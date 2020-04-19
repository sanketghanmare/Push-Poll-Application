const form = document.getElementById('vote-form');

form.addEventListener('submit', ev => {
    const choice = document.querySelector('input[name=os]:checked').value;
    const data = {os: choice};
    fetch('http://localhost:3001/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
                                 'Content-Type': 'application/json'
                             })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .then(err => console.log(err));
    ev.preventDefault();
});

fetch('http://localhost:3001/poll')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const votes = data.votes;
        const totalVotes = votes.length;
        //count votes point
        const voteCounts = votes.reduce(
            (acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
        ),
            {}
            );
        let dataPoints = [
            {label: "Windows", y: voteCounts.Windows},
            {label: "MacOS", y: voteCounts.MacOS},
            {label: "Linux", y: voteCounts.Linux},
            {label: "Other", y: voteCounts.Other}
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes ${totalVotes}`
                },
                data: [{
                    type: 'column',
                    dataPoints: dataPoints
                }]
            });
            chart.render();

            Pusher.logToConsole = true;

            const pusher = new Pusher('65aeb3a8271d3d04ab6f', {
                cluster: 'us2',
                forceTLS: true
            });

            const channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function (data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label === data.os) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });
                chart.render();
            });
        }
    });

