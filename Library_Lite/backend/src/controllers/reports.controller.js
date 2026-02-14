const supabase = require("../db/supabaseClient");

/**
 * OVERDUE REPORT
 */
exports.overdueReport = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("loans")
      .select(`
        id,
        book_id,
        book:books(title, author),
        member_id,
        member:members(first_name, last_name),
        loan_date,
        due_date
      `)
      .lt("due_date", today)
      .eq("returned", false)
      .order("due_date", { ascending: true }); // soonest overdue first

    if (error) return res.status(500).json(error);

    // Add days_overdue
    const loansWithOverdue = data.map((loan) => {
      const due = new Date(loan.due_date);
      const now = new Date(today);
      const diffDays = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
      return { ...loan, days_overdue: diffDays };
    });

    // Sort descending by days_overdue
    loansWithOverdue.sort((a, b) => b.days_overdue - a.days_overdue);

    res.json(loansWithOverdue);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch overdue report", error: err });
  }
};

/**
 * TOP BOOKS REPORT
 */
exports.topBooksReport = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("checkout_count", { ascending: false })
      .order("title", { ascending: true }) // tie-breaker
      .limit(limit);

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top books report", error: err });
  }
};
