const supabase = require("../db/supabaseClient");

/**
 * CREATE MEMBER
 */
exports.createMember = async (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ message: "First and last name required" });
  }

  const { data, error } = await supabase
    .from("members")
    .insert([{ first_name, last_name }])
    .select()
    .single();

  if (error) return res.status(500).json(error);

  res.status(201).json(data);
};

/**
 * GET MEMBERS + ACTIVE LOANS
 */
exports.getMembers = async (req, res) => {
  try {
    // Get all members
    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("*")
      .order("first_name", { ascending: true });

    if (membersError) return res.status(500).json(membersError);

    // For each member, get active loans
    const membersWithLoans = await Promise.all(
      members.map(async (member) => {
        const { data: loans, error: loansError } = await supabase
          .from("loans")
          .select(`
            id,
            book_id,
            book:books(title, author, tags),
            loan_date,
            due_date
          `)
          .eq("member_id", member.id)
          .eq("returned", false);

        if (loansError) return { ...member, loans: [], error: loansError };

        return { ...member, active_loans: loans };
      })
    );

    res.json(membersWithLoans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members", error: err });
  }
};

/**
 * DELETE MEMBER
 */
exports.deleteMember = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) return res.status(500).json(error);

  res.json({ message: "Member deleted successfully" });
};

/**
 * UPDATE MEMBER
 */
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({
      message: "First and last name required"
    });
  }

  const { data, error } = await supabase
    .from("members")
    .update({ first_name, last_name })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      message: "Failed to update member",
      error
    });
  }

  res.json(data);
};
