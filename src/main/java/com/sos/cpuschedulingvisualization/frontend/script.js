
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

    // Generate process input rows
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

    // Clear All
    clearAllBtn.addEventListener('click', function() {
        processRowsDiv.innerHTML = '';
        numProcessesInput.value = 3;
    });

    // Algorithm Controls
    algorithm.addEventListener('change', function() {
        rrQuantum.style.display = algorithm.value === 'RR' ? 'inline' : 'none';
        mlfqPanel.style.display = algorithm.value === 'MLFQ' ? 'inline' : 'none';
    });

    // MLFQ settings
    function renderMLFQInputs() {
        mlfqInputs.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            let div = document.createElement('div');
            div.innerHTML = `
                <label>Quantum Q${i}:</label>
                <input type="number" min="1" id="mlfqQuantum${i}" value="2">
                <label>Allotment Q${i}:</label>
                <input type="number" min="1" id="mlfqAllotment${i}" value="2">
            `;
            mlfqInputs.appendChild(div);
        }
        let div = document.createElement('div');
        div.innerHTML = `<label>Quantum Q3 (FCFS):</label> <input type="text" value="FCFS" disabled>`;
        mlfqInputs.appendChild(div);
    }
    renderMLFQInputs();

    // Simulation
    simulationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Gather process data from rows
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
            quantums.push('FCFS');
            ({result, gantt, metrics} = runMLFQ(processes, quantums, allotments));
        }
        renderGantt(gantt);
        renderMetrics(metrics);
    });

    // Algorithm Controls
    algorithm.addEventListener('change', function() {
        rrQuantum.style.display = algorithm.value === 'RR' ? 'inline' : 'none';
        mlfqPanel.style.display = algorithm.value === 'MLFQ' ? 'inline' : 'none';
    });

    // MLFQ settings
    function renderMLFQInputs() {
        mlfqInputs.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            let div = document.createElement('div');
            div.innerHTML = `
                <label>Quantum Q${i}:</label>
                <input type="number" min="1" id="mlfqQuantum${i}" value="2">
                <label>Allotment Q${i}:</label>
                <input type="number" min="1" id="mlfqAllotment${i}" value="2">
            `;
            mlfqInputs.appendChild(div);
        }
        let div = document.createElement('div');
        div.innerHTML = `<label>Quantum Q3 (FCFS):</label> <input type="text" value="FCFS" disabled>`;
        mlfqInputs.appendChild(div);
    }
    renderMLFQInputs();

    // Simulation
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
        // Assign a unique color for each process
        const palette = [
            '#ff69b4', // pink
            '#6ec6ff', // blue
            '#ffd54f', // yellow
            '#81c784', // green
            '#ba68c8', // purple
            '#ff8a65', // orange
            '#a1887f', // brown
            '#90a4ae', // gray
            '#f06292', // magenta
            '#4db6ac'  // teal
        ];
        // Extract process number from pid (e.g., P1 -> 1)
        let idx = 0;
        if (typeof pid === 'string' && pid.length > 1 && !isNaN(parseInt(pid.slice(1)))) {
            idx = (parseInt(pid.slice(1)) - 1) % palette.length;
        } else if (!isNaN(parseInt(pid))) {
            idx = (parseInt(pid) - 1) % palette.length;
        }
        return palette[idx];
    }

    // Gantt chart rendering is excluded as requested.
        // Real-time graph effect
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
        const pxPerUnit = 40; // pixels per unit of time
        chart.style.position = 'relative';
        chart.style.height = '90px';
        let totalWidth = 0;
        let idx = 0;
        function animateBar() {
            if (idx >= gantt.length) return;
            let bar = gantt[idx];
            let barDiv = document.createElement('div');
            barDiv.className = 'gantt-bar';
            barDiv.innerText = bar.pid;
            barDiv.style.background = getProcessColor(bar.pid);
            barDiv.style.opacity = '1';
            barDiv.style.width = '0px';
            barDiv.style.position = 'absolute';
            barDiv.style.left = (totalWidth) + 'px';
            barDiv.style.top = '30px';
            barDiv.style.height = '40px';
            barDiv.style.lineHeight = '40px';
            barDiv.style.textAlign = 'center';
            barDiv.style.borderRadius = '6px';
            barDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            chart.appendChild(barDiv);
            // Animate bar width
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
        const metricsDiv = document.getElementById('metrics');
        if (!metrics || !metrics.details || metrics.details.length === 0) {
            metricsDiv.innerHTML = '<em>No metrics available.</em>';
            return;
        }
        let html = '<table><thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Start</th><th>Finish</th><th>Waiting</th><th>Turnaround</th></tr></thead><tbody>';
        metrics.details.forEach(m => {
            html += `<tr><td>P${m.pid}</td><td>${m.arrival}</td><td>${m.burst}</td><td>${m.start}</td><td>${m.finish}</td><td>${m.waiting}</td><td>${m.turnaround}</td></tr>`;
        });
        html += '</tbody></table>';
        html += `<div style="margin-top:10px;"><strong>Average Waiting Time:</strong> ${metrics.avgWaiting.toFixed(2)}<br><strong>Average Turnaround Time:</strong> ${metrics.avgTurnaround.toFixed(2)}</div>`;
        metricsDiv.innerHTML = html;
    }

    // --- Scheduling Algorithm Stubs ---
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
        let lastIdx = null;
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
        // Build Gantt chart bars
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
        // Build Gantt chart bars
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
        // This is a stub for demonstration. Real MLFQ logic can be added as needed.
        let gantt = [];
        let metrics = {details: [], avgWaiting: 0, avgTurnaround: 0};
        let time = 0;
        processes.forEach(p => {
            let start = Math.max(time, p.arrival);
            let finish = start + p.burst;
            gantt.push({pid: p.pid, start, end: finish});
            let waiting = start - p.arrival;
            let turnaround = finish - p.arrival;
            metrics.details.push({pid: p.pid, arrival: p.arrival, burst: p.burst, start, finish, waiting, turnaround});
            time = finish;
        });
        metrics.avgWaiting = metrics.details.reduce((sum, m) => sum + m.waiting, 0) / processes.length;
        metrics.avgTurnaround = metrics.details.reduce((sum, m) => sum + m.turnaround, 0) / processes.length;
        return {result: '', gantt, metrics};
    }
});
