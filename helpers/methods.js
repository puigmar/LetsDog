const trasformToRegularTime = (num) => {
    let rawTotal = num / (1000 * 3600);
    let hours = Math.floor(rawTotal);
    let minutes = (Math.ceil(rawTotal) - rawTotal) * 60;
    minutes === 0 ? (minutes = '') : (minutes = minutes.toFixed(0));
    hours === 0 ? (hours = '') : (hours = hours);

    return {
        hours: hours,
        minutes: minutes
    }
}

module.exports = {
    trasformToRegularTime
}