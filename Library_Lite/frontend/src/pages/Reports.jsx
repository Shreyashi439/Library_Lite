import { useEffect, useState } from "react";
import {
  getOverdueReport,
  getTopBooksReport
} from "../api/reports.api";

function Reports() {
  const [overdue, setOverdue] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [limit, setLimit] = useState(5);

  const fetchOverdue = async () => {
    const res = await getOverdueReport();
    setOverdue(res.data);
  };

  const fetchTopBooks = async () => {
    const res = await getTopBooksReport(limit);
    setTopBooks(res.data);
  };

  useEffect(() => {
    fetchOverdue();
  }, []);

  useEffect(() => {
    fetchTopBooks();
  }, [limit]);

  return (
    <div>
      <h2>Reports</h2>

      {/* OVERDUE REPORT */}
      <div style={{ marginBottom: 40 }}>
        <h3>Overdue Loans</h3>

        {overdue.length === 0 ? (
          <p>No overdue loans 🎉</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Book</th>
                <th>Member</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((loan) => (
                <tr key={loan.id}>
                  <td>
                    {loan.book.title} — {loan.book.author}
                  </td>
                  <td>
                    {loan.member.first_name}{" "}
                    {loan.member.last_name}
                  </td>
                  <td>{loan.due_date}</td>
                  <td>{loan.days_overdue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* TOP BOOKS REPORT */}
      <div>
        <h3>Top Books</h3>

        <label>
          Show Top:
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Checkout Count</th>
            </tr>
          </thead>
          <tbody>
            {topBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.checkout_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
