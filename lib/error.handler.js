
function log(err, filename, line) {
    if(filename) console.warn("filename ::: " + filename);
    if(line) console.warn("line ::: " + line);

    console.error("message ::: " + err.message);
}

module.exports = {
    log : log
};