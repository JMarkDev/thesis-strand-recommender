const handleLogout = (req, res) => {
    // Clear the 'token' cookie
    res.clearCookie('token', { httpOnly: true });
  
    // Return a JSON response indicating successful logout
    return res.status(200).json({ status: "Success" });
  };
  
  module.exports = { handleLogout };
  