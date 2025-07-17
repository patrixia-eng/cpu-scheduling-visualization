document.addEventListener('DOMContentLoaded', function() {
    let processList = [];
    const numProcessesInput = document.getElementById('numProcesses');
    const generateRowsBtn = document.getElementById('generateRows');
    const processRowsDiv = document.getElementById('processRows');
    const clearAllBtn = document.getElementById('clearAll');
    const algorithm = document.getElementById('algorithm');
    const rrQuantum = document.getElementById('rrQuantum');
    const quantum = document.getElementById('quantum');
    const mlfqPanel = document.getElementById('mlfqPanel');
    const mlfqInputs = document.getElementById('mlfqInputs');
    const runSimBtn = document.getElementById('runSim');

    generateRowsBtn.addEventListener('click', function() {
        let n = parseInt(numProcessesInput.value);
        if (isNaN(n) || n < 1) return;
        processRowsDiv.innerHTML = '';
        for (let i = 0; i < n; i++) {
            let row = document.createElement('div');
            row.className = 'process-row';
            row.innerHTML = `
                <label>PID:</label>
                <input type="text" class="pid" value="${i+1}" style="width:40px;">
                <label>Arrival:</label>
                <input type="number" class="arrival" min="0" value="0" style="width:60px;">
                <label>Burst:</label>
                <input type="number" class="burst" min="1" value="1" style="width:60px;">
            `;
            processRowsDiv.appendChild(row);
        }
    });

    clearAllBtn.addEventListener('click', function() {
        processRowsDiv.innerHTML = '';
        numProcessesInput.value = 3;
    });

    algorithm.addEventListener('change', function() {
        rrQuantum.style.display = algorithm.value === 'RR' ? 'inline' : 'none';
        mlfqPanel.style.display = algorithm.value === 'MLFQ' ? 'inline' : 'none';
    });

    function renderMLFQInputs() {
        mlfqInputs.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            let div = document.createElement('div');
            div.innerHTML = `
                <label>Q${i} Quantum:</label>
                <input type="number" min="1" id="mlfqQuantum${i}" value="2">
                <label>Allotment:</label>
                <input type="number" min="1" id="mlfqAllotment${i}" value="2">
            `;
            mlfqInputs.appendChild(div);
        }
    }
    renderMLFQInputs();

    runSimBtn.addEventListener('click', function() {
        let rows = processRowsDiv.querySelectorAll('.process-row');
        processList = [];
        let ids = new Set();
        for (let i = 0; i < rows.length; i++) {
            let pid = rows[i].querySelector('.pid').value.trim();
            let arrival = parseInt(rows[i].querySelector('.arrival').value);
            let burst = parseInt(rows[i].querySelector('.burst').value);
            if (!pid || isNaN(arrival) || arrival < 0 || isNaN(burst) || burst < 1) {
                showError(Invalid input for process ${i+1});
                return;
            }
            if (ids.has(pid)) {
                showError('Process IDs must be unique.');
                return;
            }
            ids.add(pid);
            processList.push({pid, arrival, burst});
        }
        if (processList.length === 0) {
            showError('Please add at least one process.');
            return;
        }
        let algo = algorithm.value;
        let result;
        if (algo === 'FCFS') result = runFCFS(processList);
        else if (algo === 'SJF') result = runSJF(processList);
        else if (algo === 'SRTF') result = runSRTF(processList);
        else if (algo === 'RR') {
            let q = parseInt(quantum.value);
            if (isNaN(q) || q < 1) {
                showError('Invalid quantum value.');
                return;
            }
            result = runRR(processList, q);
        } else if (algo === 'MLFQ') {
            let quantums = [], allotments = [];
            for (let i = 0; i < 3; i++) {
                let q = parseInt(document.getElementById('mlfqQuantum'+i).value);
                let a = parseInt(document.getElementById('mlfqAllotment'+i).value);
                if (isNaN(q) || isNaN(a)) {
                    showError('Invalid MLFQ quantum/allotment value.');
                    return;
                }
                quantums.push(q);
                allotments.push(a);
            }
            quantums.push(9999);
            result = runMLFQ(processList, quantums, allotments);
        }
        renderGantt(result.gantt);
        renderMetrics(result.metrics);
    });

    function showError(msg) {
        document.getElementById('ganttChart').innerHTML = <span style="color:red;">${msg}</span>;
        document.getElementById('metrics').innerHTML = '';
    }

    const ganttColors = [
        '#e75480', '#ffb6d5', '#ff69b4', '#ff8ecf', '#ffb3de', '#ff6f91', '#ffb7c5', '#f88379', '#f7cac9', '#f49ac2', '#f3c6e0', '#fbaed2', '#f7a1c4', '#f9c6d3', '#f6abb6', '#f7b7a3'
    ];

    function getBarColor(pid) {
        let hash = 0;
        for (let i = 0; i < pid.length; i++) hash = pid.charCodeAt(i) + ((hash << 5) - hash);
        return ganttColors[Math.abs(hash) % ganttColors.length];
    }

    function renderGantt(gantt) {
        const chart = document.getElementById('ganttChart');
        const sequenceDiv = document.getElementById('ganttSequence');
        chart.innerHTML = '';
        if (!gantt || gantt.length === 0) {
            chart.innerHTML = '<em>No Gantt chart available.</em>';
            sequenceDiv.innerHTML = '';
            return;
        }
        const sequence = gantt.map(bar => P${bar.pid}).join(' | ');
        sequenceDiv.innerHTML = | ${sequence} |;
        let i = 0;
        function animateBar() {
            if (i >= gantt.length) return;
            let bar = gantt[i];
            let barDiv = document.createElement('div');
            barDiv.className = 'gantt-bar';
            barDiv.innerText = P${bar.pid};
            let color = getBarColor(bar.pid);
            barDiv.style.setProperty('--bar-color', color);
            barDiv.setAttribute('data-color', '1');
            barDiv.style.fontSize = '2em';
            barDiv.style.transition = 'transform 0.4s, background 0.3s';
            chart.appendChild(barDiv);
            chart.scrollLeft = chart.scrollWidth;
            i++;
            setTimeout(animateBar, 400);
        }
        animateBar();
    }

    function renderMetrics(metrics) {
        const metricsDiv = document.getElementById('metrics');
        if (!metrics || !metrics.details || metrics.details.length === 0) {
            metricsDiv.innerHTML = '<em>No metrics available.</em>';
            return;
        }
        const sorted = [...metrics.details].sort((a, b) => {
            let getNum = pid => typeof pid === 'string' && pid[0].toUpperCase() === 'P' ? parseInt(pid.slice(1)) : parseInt(pid);
            return getNum(a.pid) - getNum(b.pid);
        });
        let html = '<table><thead><tr><th>PID</th><th>Arrival</th><th>Burst</th><th>Start</th><th>Finish</th><th>Waiting</th><th>Turnaround</th><th>Response</th></tr></thead><tbody>';
        sorted.forEach(m => {
            html += <tr><td>${m.pid}</td><td>${m.arrival}</td><td>${m.burst}</td><td>${m.start}</td><td>${m.finish}</td><td>${m.waiting}</td><td>${m.turnaround}</td><td>${m.response}</td></tr>;
        });
        html += '</tbody></table>';
        html += <div style="margin-top:10px;font-size:25px;"><strong>Average Waiting Time:</strong> ${metrics.avgWaiting.toFixed(2)}<br><strong>Average Turnaround Time:</strong> ${metrics.avgTurnaround.toFixed(2)}<br><strong>Average Response Time:</strong> ${metrics.avgResponse.toFixed(2)}</div>;
        metricsDiv.innerHTML = html;
    }

    function runFCFS(processes) {
        processes = [...processes].map(p => ({...p})).sort((a, b) => a.arrival - b.arrival);
        let time = 0, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0, avgResponse: 0};
        let totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        processes.forEach(p => {
            time = Math.max(time, p.arrival);
            let start = time;
            let finish = time + p.burst;
            gantt.push({pid: p.pid, start, end: finish});
            let waiting = start - p.arrival;
            let turnaround = finish - p.arrival;
            let response = waiting;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start, finish, waiting, turnaround, response});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
            time = finish;
        });
        let n = processes.length;
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        metrics.avgResponse = totalResponse / n;
        return {gantt, metrics};
    }

    function runSJF(processes) {
        let n = processes.length, completed = 0, time = 0, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0, avgResponse: 0};
        let done = Array(n).fill(false);
        let totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        let procs = processes.map(p => ({...p}));
        while (completed < n) {
            let idx = -1, minBurst = Infinity;
            for (let i = 0; i < n; i++) {
                if (!done[i] && procs[i].arrival <= time && procs[i].burst < minBurst) {
                    minBurst = procs[i].burst;
                    idx = i;
                }
            }
            if (idx === -1) {
                time++;
                continue;
            }
            let p = procs[idx];
            let start = Math.max(time, p.arrival);
            let finish = start + p.burst;
            gantt.push({pid: p.pid, start, end: finish});
            let waiting = start - p.arrival;
            let turnaround = finish - p.arrival;
            let response = waiting;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start, finish, waiting, turnaround, response});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
            time = finish;
            done[idx] = true;
            completed++;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        metrics.avgResponse = totalResponse / n;
        return {gantt, metrics};
    }

    function runSRTF(processes) {
        let n = processes.length, completed = 0, time = 0, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0, avgResponse: 0};
        let procs = processes.map(p => ({...p, remaining: p.burst, start: null, finish: null, response: null}));
        let timeline = [];
        while (completed < n) {
            let idx = -1, minRem = Infinity;
            for (let i = 0; i < n; i++) {
                if (procs[i].arrival <= time && procs[i].remaining > 0 && procs[i].remaining < minRem) {
                    minRem = procs[i].remaining;
                    idx = i;
                }
            }
            if (idx === -1) {
                timeline.push(null);
                time++;
                continue;
            }
            let p = procs[idx];
            if (p.start === null) {
                p.start = time;
                p.response = time - p.arrival;
            }
            p.remaining--;
            timeline.push(idx);
            if (p.remaining === 0) {
                p.finish = time + 1;
                completed++;
            }
            time++;
        }
        let bars = [];
        let prev = timeline[0], start = 0;
        for (let t = 1; t <= timeline.length; t++) {
            if (t === timeline.length || timeline[t] !== prev) {
                if (prev !== null) bars.push({pid: procs[prev].pid, start, end: t});
                start = t;
                prev = timeline[t];
            }
        }
        gantt = bars;
        let totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        for (let i = 0; i < n; i++) {
            let p = procs[i];
            let waiting = (p.finish - p.arrival) - p.burst;
            let turnaround = p.finish - p.arrival;
            let response = p.response;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start: p.start, finish: p.finish, waiting, turnaround, response});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        metrics.avgResponse = totalResponse / n;
        return {gantt, metrics};
    }

    function runRR(processes, quantum) {
        let n = processes.length, completed = 0, time = 0, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0, avgResponse: 0};
        let procs = processes.map(p => ({...p, remaining: p.burst, start: null, finish: null, response: null}));
        let queue = [], timeline = [];
        let arrived = Array(n).fill(false);
        while (completed < n) {
            for (let i = 0; i < n; i++) {
                if (!arrived[i] && procs[i].arrival <= time) {
                    queue.push(i);
                    arrived[i] = true;
                }
            }
            if (queue.length === 0) {
                timeline.push(null);
                time++;
                continue;
            }
            let idx = queue.shift();
            let p = procs[idx];
            if (p.start === null) {
                p.start = time;
                p.response = time - p.arrival;
            }
            let slice = Math.min(quantum, p.remaining);
            for (let t = 0; t < slice; t++) {
                timeline.push(idx);
                time++;
                for (let i = 0; i < n; i++) {
                    if (!arrived[i] && procs[i].arrival <= time) {
                        queue.push(i);
                        arrived[i] = true;
                    }
                }
            }
            p.remaining -= slice;
            if (p.remaining === 0) {
                p.finish = time;
                completed++;
            } else {
                queue.push(idx);
            }
        }
        let bars = [];
        let prev = timeline[0], start = 0;
        for (let t = 1; t <= timeline.length; t++) {
            if (t === timeline.length || timeline[t] !== prev) {
                if (prev !== null) bars.push({pid: procs[prev].pid, start, end: t});
                start = t;
                prev = timeline[t];
            }
        }
        gantt = bars;
        let totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        for (let i = 0; i < n; i++) {
            let p = procs[i];
            let waiting = (p.finish - p.arrival) - p.burst;
            let turnaround = p.finish - p.arrival;
            let response = p.response;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start: p.start, finish: p.finish, waiting, turnaround, response});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        metrics.avgResponse = totalResponse / n;
        return {gantt, metrics};
    }

    function runMLFQ(processes, quantums, allotments) {
        let n = processes.length, completed = 0, time = 0, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0, avgResponse: 0};
        let procs = processes.map(p => ({...p, remaining: p.burst, start: null, finish: null, response: null, level: 0, allot: 0}));
        let queues = [[], [], [], []];
        let timeline = [];
        let arrived = Array(n).fill(false);
        while (completed < n) {
            for (let i = 0; i < n; i++) {
                if (!arrived[i] && procs[i].arrival <= time) {
                    queues[0].push(i);
                    arrived[i] = true;
                }
            }
            let current = null, currentLevel = null;
            for (let l = 0; l < 4; l++) {
                if (queues[l].length > 0) {
                    current = queues[l].shift();
                    currentLevel = l;
                    break;
                }
            }
            if (current === null) {
                timeline.push(null);
                time++;
                continue;
            }
            let p = procs[current];
            if (p.start === null) {
                p.start = time;
                p.response = time - p.arrival;
            }
            let q = (currentLevel === 3) ? 9999 : quantums[currentLevel];
            let allot = (currentLevel === 3) ? 9999 : allotments[currentLevel];
            let slice = Math.min(q, p.remaining, allot - p.allot);
            for (let t = 0; t < slice; t++) {
                timeline.push({idx: current, level: currentLevel});
                time++;
                for (let i = 0; i < n; i++) {
                    if (!arrived[i] && procs[i].arrival <= time) {
                        queues[0].push(i);
                        arrived[i] = true;
                    }
                }
            }
            p.remaining -= slice;
            p.allot += slice;
            if (p.remaining === 0) {
                p.finish = time;
                completed++;
            } else if (currentLevel < 3 && p.allot >= allotments[currentLevel]) {
                p.level++;
                p.allot = 0;
                queues[currentLevel + 1].push(current);
            } else {
                queues[currentLevel].push(current);
            }
        }
        let bars = [];
        let prev = timeline[0], start = 0;
        for (let t = 1; t <= timeline.length; t++) {
            if (t === timeline.length || JSON.stringify(timeline[t]) !== JSON.stringify(prev)) {
                if (prev !== null) {
                    let p = procs[prev.idx];
                    bars.push({pid: p.pid, start, end: t, queue: prev.level});
                }
                start = t;
                prev = timeline[t];
            }
        }
        gantt = bars;
        let totalWaiting = 0, totalTurnaround = 0, totalResponse = 0;
        for (let i = 0; i < n; i++) {
            let p = procs[i];
            let waiting = (p.finish - p.arrival) - p.burst;
            let turnaround = p.finish - p.arrival;
            let response = p.response;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start: p.start, finish: p.finish, waiting, turnaround, response});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            totalResponse += response;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        metrics.avgResponse = totalResponse / n;
        return {gantt, metrics};
    }
})
