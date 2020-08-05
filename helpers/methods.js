const trasformToRegularTime = (num) => {
    const result = {}
    let rawTotal = num / (1000 * 3600);
    let hours = Math.floor(rawTotal);
    let minutes = (Math.ceil(rawTotal) - rawTotal) * 60;

    if(hours !== 0) result.hours = hours;
    if(minutes !== 0) result.minutes = Number(minutes.toFixed(0));

    return result
}

module.exports = {
    trasformToRegularTime
}