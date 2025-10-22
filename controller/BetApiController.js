
exports.ParamsBet = (req, res) => {
  
  res.render("BetView", { matchid: req.params.id});
  
}