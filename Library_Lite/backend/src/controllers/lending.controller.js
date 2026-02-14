const supabase = require("../db/supabaseClient");
const { addDays } = require("../utils/date");

/**
 * LEND BOOK
 */
exports.lendBook = async (req, res) => {
  const { book_id, member_id } = req.body;

  if (!book_id || !member_id)
    return res.status(400).json({ message: "Book ID and Member ID required" });

  try {
    // Get book status
    const { data: bookData, error: bookError } = await supabase
      .from("books")
      .select("*")
      .eq("id", book_id)
      .single();

    if (bookError || !bookData)
      return res.status(404).json({ message: "Book not found" });

    // If available → assign loan
    if (bookData.status === "AVAILABLE") {
      const today = new Date().toISOString().split("T")[0];
      const dueDate = addDays(today, 7); // Utility function

      const { data: loanData, error: loanError } = await supabase
        .from("loans")
        .insert([
          { book_id, member_id, loan_date: today, due_date: dueDate }
        ])
        .select()
        .single();

      if (loanError) return res.status(500).json(loanError);

      // Update book status and increment checkout_count
      await supabase
        .from("books")
        .update({ status: "ON_LOAN", checkout_count: bookData.checkout_count + 1 })
        .eq("id", book_id);

      return res.json({ message: "Book loaned successfully", loan: loanData });
    }

    // If ON_LOAN → add to waitlist
    // Check duplicate
    const { data: existingWaitlist } = await supabase
      .from("waitlist")
      .select("*")
      .eq("book_id", book_id)
      .eq("member_id", member_id)
      .single();

    if (existingWaitlist)
      return res.status(409).json({ message: "Member already in waitlist" });

    // Determine next position
    const { data: waitlistData } = await supabase
      .from("waitlist")
      .select("position")
      .eq("book_id", book_id)
      .order("position", { ascending: false })
      .limit(1);

    const nextPosition = waitlistData.length ? waitlistData[0].position + 1 : 1;

    const { data: addedWaitlist, error: waitlistError } = await supabase
      .from("waitlist")
      .insert([{ book_id, member_id, position: nextPosition }])
      .select()
      .single();

    if (waitlistError) return res.status(500).json(waitlistError);

    return res.json({ message: "Book on loan, member added to waitlist", waitlist: addedWaitlist });
  } catch (err) {
    res.status(500).json({ message: "Error lending book", error: err });
  }
};

/**
 * RETURN BOOK
 */
exports.returnBook = async (req, res) => {
  const { loan_id } = req.body;

  if (!loan_id)
    return res.status(400).json({ message: "Loan ID required" });

  try {
    // Get loan
    const { data: loanData, error: loanError } = await supabase
      .from("loans")
      .select("*")
      .eq("id", loan_id)
      .single();

    if (loanError || !loanData)
      return res.status(404).json({ message: "Loan not found" });

    // Mark returned
    await supabase
      .from("loans")
      .update({ returned: true })
      .eq("id", loan_id);

    const book_id = loanData.book_id;

    // Check waitlist FIFO
    const { data: nextInLine } = await supabase
      .from("waitlist")
      .select("*")
      .eq("book_id", book_id)
      .order("position", { ascending: true })
      .limit(1);

    if (nextInLine.length) {
      const nextMember = nextInLine[0];
      const today = new Date().toISOString().split("T")[0];
      const dueDate = addDays(today, 7);

      // Create new loan
      const { data: newLoan } = await supabase
        .from("loans")
        .insert([
          { book_id, member_id: nextMember.member_id, loan_date: today, due_date: dueDate }
        ])
        .select()
        .single();

      // Remove from waitlist
      await supabase.from("waitlist").delete().eq("id", nextMember.id);

      // Book status remains ON_LOAN
      return res.json({
        message: "Book returned and loaned to next member in waitlist",
        loan: newLoan
      });
    }

    // No waitlist → mark book AVAILABLE
    await supabase.from("books").update({ status: "AVAILABLE" }).eq("id", book_id);

    res.json({ message: "Book returned and is now available" });
  } catch (err) {
    res.status(500).json({ message: "Error returning book", error: err });
  }
};
