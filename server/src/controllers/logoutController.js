
const handleLogout = (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
}

module.exports = { handleLogout };