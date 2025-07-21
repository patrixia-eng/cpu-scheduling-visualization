document.addEventListener('DOMContentLoaded', function() {
    let processList = [];
    const numProcessesInput = document.getElementById('numProcesses');
    const generateRowsBtn = document.getElementById('generateRows');
    const processRowsDiv = document.getElementById('processRows');
    const processInputForm = document.getElementById('processInputForm');
    const clearAllBtn = document.getElementById('clearAll');
    const algorithm = document.getElementById('algorithm');
    const rrQuantum = document.getElementById('rrQuantum');
    const quantum = document.getElementById('quantum');
    const mlfqPanel = document.getElementById('mlfqPanel');
    const mlfqInputs = document.getElementById('mlfqInputs');
    const simulationForm = document.getElementById('simulationForm');

    generateRowsBtn.addEventListener('click', function() {
        let n = parseInt(numProcessesInput.value);
        if (isNaN(n) || n < 1) {
            alert('Please enter a valid number of processes.');
            return;
        }
        processRowsDiv.innerHTML = '';
        for (let i = 0; i < n; i++) {
            let row = document.createElement('div');
            row.className = 'process-row';
            row.innerHTML = `
                <label>Process ID:</label>
                <input type="text" class="pid" value="P${i+1}" required style="width:60px;">
                <label>Arrival Time:</label>
                <input type="number" class="arrival" min="0" value="0" required style="width:60px;">
                <label>Burst Time:</label>
                <input type="number" class="burst" min="1" value="1" required style="width:60px;">
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
        for (let i = 0; i < 4; i++) {
            let div = document.createElement('div');
            div.innerHTML = `
                <label>Quantum Q${i}:</label>
                <input type="number" min="1" id="mlfqQuantum${i}" value="2">
                <label>Allotment Q${i}:</label>
                <input type="number" min="1" id="mlfqAllotment${i}" value="2">
            `;
            mlfqInputs.appendChild(div);
        }
    }
    renderMLFQInputs();

    simulationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let rows = processRowsDiv.querySelectorAll('.process-row');
        processList = [];
        let ids = new Set();
        for (let i = 0; i < rows.length; i++) {
            let pid = rows[i].querySelector('.pid').value.trim();
            let arrival = parseInt(rows[i].querySelector('.arrival').value);
            let burst = parseInt(rows[i].querySelector('.burst').value);
            if (!pid || isNaN(arrival) || arrival < 0 || isNaN(burst) || burst < 1) {
                showError(`Invalid input for process ${i+1}`);
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
        let processes = processList.map(p => ({...p}));
        let algo = algorithm.value;
        let result, gantt, metrics;
        if (algo === 'FCFS') {
            ({result, gantt, metrics} = runFCFS(processes));
        } else if (algo === 'SJF') {
            ({result, gantt, metrics} = runSJF(processes));
        } else if (algo === 'SRTF') {
            ({result, gantt, metrics} = runSRTF(processes));
        } else if (algo === 'RR') {
            let q = parseInt(quantum.value);
            if (isNaN(q) || q < 1) {
                showError('Invalid quantum value.');
                return;
            }
            ({result, gantt, metrics} = runRR(processes, q));
        } else if (algo === 'MLFQ') {
            let quantums = [];
            let allotments = [];
            for (let i = 0; i < 4; i++) {
                let q = parseInt(document.getElementById('mlfqQuantum'+i).value);
                let a = parseInt(document.getElementById('mlfqAllotment'+i).value);
                if (isNaN(q) || isNaN(a)) {
                    showError('Invalid MLFQ quantum/allotment value.');
                    return;
                }
                quantums.push(q);
                allotments.push(a);
            }
            quantums.push('FCFS');
            ({result, gantt, metrics} = runMLFQ(processes, quantums, allotments));
        }
        renderGantt(gantt);
        renderMetrics(metrics);
    });

    algorithm.addEventListener('change', function() {
        rrQuantum.style.display = algorithm.value === 'RR' ? 'inline' : 'none';
        mlfqPanel.style.display = algorithm.value === 'MLFQ' ? 'inline' : 'none';
    });

    function renderMLFQInputs() {
        mlfqInputs.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            let div = document.createElement('div');
            div.innerHTML = `
                <label>Quantum Q${i}:</label>
                <input type="number" min="1" id="mlfqQuantum${i}" value="2">
                <label>Allotment Q${i}:</label>
                <input type="number" min="1" id="mlfqAllotment${i}" value="2">
            `;
            mlfqInputs.appendChild(div);
        }
    }
    renderMLFQInputs();

    simulationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (processList.length === 0) {
            showError('Please add at least one process.');
            return;
        }
        let processes = processList.map(p => ({...p}));
        let algo = algorithm.value;
        let result, gantt, metrics;
        if (algo === 'FCFS') {
            ({result, gantt, metrics} = runFCFS(processes));
        } else if (algo === 'SJF') {
            ({result, gantt, metrics} = runSJF(processes));
        } else if (algo === 'SRTF') {
            ({result, gantt, metrics} = runSRTF(processes));
        } else if (algo === 'RR') {
            let q = parseInt(quantum.value);
            if (isNaN(q) || q < 1) {
                showError('Invalid quantum value.');
                return;
            }
            ({result, gantt, metrics} = runRR(processes, q));
        } else if (algo === 'MLFQ') {
            let quantums = [];
            let allotments = [];
            for (let i = 0; i < 4; i++) {
                let q = parseInt(document.getElementById('mlfqQuantum'+i).value);
                let a = parseInt(document.getElementById('mlfqAllotment'+i).value);
                if (isNaN(q) || isNaN(a)) {
                    showError('Invalid MLFQ quantum/allotment value.');
                    return;
                }
                quantums.push(q);
                allotments.push(a);
            }
            quantums.push('FCFS');
            ({result, gantt, metrics} = runMLFQ(processes, quantums, allotments));
        }
        renderGantt(gantt);
        renderMetrics(metrics);
    });

    function showError(msg) {
        document.getElementById('ganttChart').innerHTML = `<span style="color:red;">${msg}</span>`;
        document.getElementById('metrics').innerHTML = '';
    }

    function getProcessColor(pid) {
        const palette = [
            '#ff69b4',
            '#6ec6ff',
            '#ffd54f',
            '#81c784',
            '#ba68c8',
            '#ff8a65',
            '#a1887f',
            '#90a4ae',
            '#f06292',
            '#4db6ac'
        ];
        let idx = 0;
        if (typeof pid === 'string' && pid.length > 1 && !isNaN(parseInt(pid.slice(1)))) {
            idx = (parseInt(pid.slice(1)) - 1) % palette.length;
        } else if (!isNaN(parseInt(pid))) {
            idx = (parseInt(pid) - 1) % palette.length;
        }
        return palette[idx];
    }

        let i = 0;
        function showNext() {
            if (i < elements.length) {
                chart.appendChild(elements[i]);
                if (elements[i].className === 'gantt-bar') {
                    setTimeout(() => {
                        elements[i].style.transition = 'opacity 0.3s, width 0.6s cubic-bezier(.4,2,.6,1)';
                        elements[i].style.opacity = '1';
                        elements[i].style.width = elements[i].dataset.targetWidth + 'px';
                        i++;
                        showNext();
                    }, 600);
                } else {
                    i++;
                    showNext();
                }
            }
        }
        showNext();
   


    function showError(msg) {
        document.getElementById('ganttChart').innerHTML = `<span style="color:red;">${msg}</span>`;
        document.getElementById('metrics').innerHTML = '';
    }

    function renderGantt(gantt) {
        const chart = document.getElementById('ganttChart');
        chart.innerHTML = '';
        if (!gantt || gantt.length === 0) {
            chart.innerHTML = '<em>No Gantt chart available.</em>';
            return;
        }
        const pxPerUnit = 40;
        chart.style.position = 'relative';
        chart.style.height = '90px';
        let totalWidth = 0;
        let idx = 0;
        function animateBar() {
            if (idx >= gantt.length) return;
            let bar = gantt[idx];
            let barDiv = document.createElement('div');
            barDiv.className = 'gantt-bar';
            barDiv.innerHTML = `
                <div>${bar.pid}</div>
                <div style="font-size:0.85em;">
                    <span style="color:#333;">Arr: ${bar.start}</span><br>
                    <span style="color:#333;">Comp: ${bar.end}</span>
                    ${bar.queue ? `<br><span style="color:#333;">${bar.queue}</span>` : ''}
                </div>
            `;
            barDiv.style.background = getProcessColor(bar.pid);
            barDiv.style.opacity = '1';
            barDiv.style.width = '0px';
            barDiv.style.position = 'absolute';
            barDiv.style.left = (totalWidth) + 'px';
            barDiv.style.top = '30px';
            barDiv.style.height = '60px';
            barDiv.style.lineHeight = '20px';
            barDiv.style.textAlign = 'center';
            barDiv.style.borderRadius = '6px';
            barDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            chart.appendChild(barDiv);
            let targetWidth = (bar.end - bar.start) * pxPerUnit;
            let startTime = null;
            function growBar(ts) {
                if (!startTime) startTime = ts;
                let elapsed = ts - startTime;
                let duration = 600; // ms
                let progress = Math.min(elapsed / duration, 1);
                barDiv.style.width = (targetWidth * progress) + 'px';
                if (progress < 1) {
                    requestAnimationFrame(growBar);
                } else {
                    totalWidth += targetWidth;
                    idx++;
                    animateBar();
                }
            }
            requestAnimationFrame(growBar);
        }
        animateBar();
    }

    function renderMetrics(metrics) {
        const metricsTable = document.getElementById('metricsTable');
        const metricsAverages = document.getElementById('metricsAverages');
        if (!metrics || !metrics.details || metrics.details.length === 0) {
            metricsTable.innerHTML = '<em>No metrics available.</em>';
            metricsAverages.innerHTML = '';
            return;
        }
        let totalTurnaround = 0, totalResponse = 0, totalCompletion = 0;
        let html = '<thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Completion</th><th>Turnaround</th><th>Response</th></tr></thead><tbody>';
        metrics.details.forEach(m => {
            let response = typeof m.response === 'number' ? m.response : (m.start !== undefined && m.arrival !== undefined ? m.start - m.arrival : 0);
            html += `<tr>
                <td>${m.pid}</td>
                <td>${m.arrival}</td>
                <td>${m.burst}</td>
                <td>${m.finish}</td>
                <td>${m.turnaround}</td>
                <td>${response}</td>
            </tr>`;
            totalTurnaround += m.turnaround;
            totalResponse += response;
            totalCompletion += m.finish;
        });
        html += '</tbody>';
        metricsTable.innerHTML = html;
        metricsAverages.innerHTML = `
            <strong>Average Completion Time:</strong> ${(totalCompletion / metrics.details.length).toFixed(2)}<br>
            <strong>Average Turnaround Time:</strong> ${(totalTurnaround / metrics.details.length).toFixed(2)}<br>
            <strong>Average Response Time:</strong> ${(totalResponse / metrics.details.length).toFixed(2)}
        `;
    }

    function runFCFS(processes) {
        processes = [...processes].sort((a, b) => a.arrival - b.arrival);
        let time = 0, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0};
        let totalWaiting = 0, totalTurnaround = 0;
        processes.forEach(p => {
            time = Math.max(time, p.arrival);
            let start = time;
            let finish = time + p.burst;
            gantt.push({pid: p.pid, start, end: finish});
            let waiting = start - p.arrival;
            let turnaround = finish - p.arrival;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start, finish, waiting, turnaround});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            time = finish;
        });
        metrics.avgWaiting = totalWaiting / processes.length;
        metrics.avgTurnaround = totalTurnaround / processes.length;
        return {result: '', gantt, metrics};
    }
    function runSJF(processes) {
        let time = 0, done = 0, n = processes.length, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0};
        let arrived = Array(n).fill(false);
        let totalWaiting = 0, totalTurnaround = 0;
        let ready = [];
        while (done < n) {
            for (let i = 0; i < n; i++) {
                if (!arrived[i] && processes[i].arrival <= time) {
                    ready.push(processes[i]);
                    arrived[i] = true;
                }
            }
            if (ready.length === 0) {
                time++;
                continue;
            }
            ready.sort((a, b) => a.burst - b.burst);
            let p = ready.shift();
            let start = time;
            let finish = time + p.burst;
            gantt.push({pid: p.pid, start, end: finish});
            let waiting = start - p.arrival;
            let turnaround = finish - p.arrival;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start, finish, waiting, turnaround});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
            time = finish;
            done++;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        return {result: '', gantt, metrics};
    }
    function runSRTF(processes) {
        let time = 0, done = 0, n = processes.length, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0};
        let remaining = processes.map(p => p.burst);
        let startTimes = Array(n).fill(null);
        let finishTimes = Array(n).fill(null);
        let totalWaiting = 0, totalTurnaround = 0;
        let timeline = [];
        while (done < n) {
            let ready = [];
            for (let i = 0; i < n; i++) {
                if (processes[i].arrival <= time && remaining[i] > 0) {
                    ready.push({idx: i, burst: remaining[i]});
                }
            }
            if (ready.length === 0) {
                time++;
                continue;
            }
            ready.sort((a, b) => a.burst - b.burst);
            let idx = ready[0].idx;
            if (startTimes[idx] === null) startTimes[idx] = time;
            timeline.push(idx);
            remaining[idx]--;
            if (remaining[idx] === 0) {
                finishTimes[idx] = time + 1;
                done++;
            }
            time++;
        }
        let bars = [];
        let prev = timeline[0], start = 0;
        for (let t = 1; t <= timeline.length; t++) {
            if (t === timeline.length || timeline[t] !== prev) {
                bars.push({pid: processes[prev].pid, start, end: t});
                start = t;
                prev = timeline[t];
            }
        }
        gantt = bars;
        for (let i = 0; i < n; i++) {
            let waiting = finishTimes[i] - processes[i].arrival - processes[i].burst;
            let turnaround = finishTimes[i] - processes[i].arrival;
            let response = startTimes[i] - processes[i].arrival;
            metrics.details.push({
                pid: processes[i].pid,
                arrival: processes[i].arrival,
                burst: processes[i].burst,
                start: startTimes[i],
                finish: finishTimes[i],
                waiting,
                turnaround,
                response
            });
            totalWaiting += waiting;
            totalTurnaround += turnaround;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        return {result: '', gantt, metrics};
    }
    function runRR(processes, quantum) {
        let time = 0, queue = [], n = processes.length, gantt = [], metrics = {details: [], avgWaiting: 0, avgTurnaround: 0};
        let remaining = processes.map(p => p.burst);
        let arrived = Array(n).fill(false);
        let finished = Array(n).fill(false);
        let startTimes = Array(n).fill(null);
        let finishTimes = Array(n).fill(null);
        let timeline = [];
        while (finished.some(f => !f)) {
            for (let i = 0; i < n; i++) {
                if (!arrived[i] && processes[i].arrival <= time) {
                    queue.push(i);
                    arrived[i] = true;
                }
            }
            if (queue.length === 0) {
                time++;
                continue;
            }
            let idx = queue.shift();
            if (startTimes[idx] === null) startTimes[idx] = time;
            let slice = Math.min(quantum, remaining[idx]);
            timeline.push({idx, start: time, end: time + slice});
            remaining[idx] -= slice;
            time += slice;
            for (let i = 0; i < n; i++) {
                if (!arrived[i] && processes[i].arrival <= time) {
                    queue.push(i);
                    arrived[i] = true;
                }
            }
            if (remaining[idx] > 0) {
                queue.push(idx);
            } else {
                finishTimes[idx] = time;
                finished[idx] = true;
            }
        }
        gantt = timeline.map(bar => ({pid: processes[bar.idx].pid, start: bar.start, end: bar.end}));
        let totalWaiting = 0, totalTurnaround = 0;
        for (let i = 0; i < n; i++) {
            let waiting = startTimes[i] - processes[i].arrival;
            let turnaround = finishTimes[i] - processes[i].arrival;
            metrics.details.push({pid: processes[i].pid, arrival: processes[i].arrival, burst: processes[i].burst, start: startTimes[i], finish: finishTimes[i], waiting, turnaround});
            totalWaiting += waiting;
            totalTurnaround += turnaround;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        return {result: '', gantt, metrics};
    }
    function runMLFQ(processes, quantums, allotments) {
        let n = processes.length;
        let time = 0;
        let ready = [];
        let gantt = [];
        let metrics = {details: [], avgWaiting: 0, avgTurnaround: 0};
        let finished = Array(n).fill(false);
        let remaining = processes.map(p => p.burst);
        let queueLevel = Array(n).fill(0);
        let allotUsed = Array(n).fill(0);
        let startTimes = Array(n).fill(null);
        let finishTimes = Array(n).fill(null);

        while (finished.some(f => !f)) {
            for (let i = 0; i < n; i++) {
                if (!finished[i] && processes[i].arrival <= time && !ready.includes(i)) {
                    ready.push(i);
                }
            }
            let minQueue = 4;
            ready.forEach(idx => {
                if (queueLevel[idx] < minQueue) minQueue = queueLevel[idx];
            });
            let candidates = ready.filter(idx => queueLevel[idx] === minQueue);
            if (candidates.length === 0) {
                time++;
                continue;
            }
            candidates.sort((a, b) => processes[a].arrival - processes[b].arrival);
            let idx = candidates[0];
            let q = queueLevel[idx];
            let quantum = quantums[q];
            let allotment = allotments[q];
            let runTime = Math.min(quantum, remaining[idx]);
            if (startTimes[idx] === null) startTimes[idx] = time;
            gantt.push({pid: processes[idx].pid, start: time, end: time + runTime, queue: `Q${q}`});
            remaining[idx] -= runTime;
            allotUsed[idx] += runTime;
            time += runTime;
            if (remaining[idx] === 0) {
                finishTimes[idx] = time;
                finished[idx] = true;
                ready = ready.filter(i => i !== idx);
                allotUsed[idx] = 0;
            } else {
                if (allotUsed[idx] >= allotment && q < 3) {
                    queueLevel[idx]++;
                    allotUsed[idx] = 0;
                }
            }
            for (let i = 0; i < n; i++) {
                if (!finished[i] && processes[i].arrival > time - runTime && processes[i].arrival <= time && !ready.includes(i)) {
                    ready.push(i);
                }
            }
        }
        let totalWaiting = 0, totalTurnaround = 0;
        for (let i = 0; i < n; i++) {
            let waiting = finishTimes[i] - processes[i].arrival - processes[i].burst;
            let turnaround = finishTimes[i] - processes[i].arrival;
            let response = startTimes[i] - processes[i].arrival;
            metrics.details.push({
                pid: processes[i].pid,
                arrival: processes[i].arrival,
                burst: processes[i].burst,
                start: startTimes[i],
                finish: finishTimes[i],
                waiting,
                turnaround,
                response
            });
            totalWaiting += waiting;
            totalTurnaround += turnaround;
        }
        metrics.avgWaiting = totalWaiting / n;
        metrics.avgTurnaround = totalTurnaround / n;
        return {result: '', gantt, metrics};
    }
});
