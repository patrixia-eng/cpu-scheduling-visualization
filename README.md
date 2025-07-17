# CPU Scheduling Visualization

### Operating Systems – Project 01

## Overview

This project is a simulation and visualization tool for various **CPU scheduling algorithms**, built as part of an Operating Systems course requirement. The goal is to help students and users understand how different CPU scheduling policies work by providing a visual representation of process executions, time calculations, and comparisons.

Developed with **Java (backend)** and **JavaScript HTML (frontend)** version.

---

## Scheduling Algorithms Implemented

1. **First Come First Serve (FCFS)** – Non-preemptive
2. **Shortest Job First (SJF)** – Non-preemptive
3. **Shortest Remaining Time First (SRTF)** – Preemptive
4. **Round Robin (RR)** – Preemptive with configurable time quantum
5. **Multilevel Feedback Queue (MLFQ)** – Preemptive, with 4 queues and configurable time quantums

---

## How to Run

### Web GUI

1. Open `index.html` in your browser.
2. Enter number of processes.
3. Fill in **Process ID**, **Arrival Time**, and **Burst Time**.
4. Select the desired scheduling algorithm.
5. Configure time quantum (for RR and MLFQ).
6. Click **Run Simulation**.

### Console Version (Java)

1. Open the Java project in NetBeans.
2. Run `Main.java` or `CPUSchedulingVisualization.java`.
3. Follow the prompts to:
   - Choose scheduling algorithm
   - Manually enter process data
   - View Gantt chart and performance metrics

---

## Output Features

- **Gantt Chart** (GUI-based)
- **Per-process metrics:**
  - Process ID
  - Arrival Time
  - Burst Time
  - Completion Time
  - Turnaround Time
  - Waiting Time
  - Response Time
- **Averages:**
  - Average Waiting Time
  - Average Turnaround Time

---

## Screenshots

### SRTF Simulation Example
![SRTF Example](<img width="1366" height="768" alt="SRTF" src="https://github.com/user-attachments/assets/48536ea7-81dd-41ff-a8ec-e9f28a99a789" />)

### FCFS Simulation Example
![FCFS Example](<img width="1366" height="768" alt="FCFS" src="https://github.com/user-attachments/assets/d4f1dd08-e26a-4369-b2e3-4a412430aa58" />)

### SJF Simulation Example
![SJF Example](<img width="1366" height="768" alt="SJF" src="https://github.com/user-attachments/assets/27fd99ae-8e75-47ac-9779-7e842130bb79" />
)

### RR Simulation Example
![RR Example](<img width="1366" height="768" alt="RR" src="https://github.com/user-attachments/assets/0388e191-80ed-44cc-8b51-f1d6610fc786" />)

### MLFQ Simulation Example
![MLFQ Example](<img width="1366" height="768" alt="MLFQ2" src="https://github.com/user-attachments/assets/7649110f-d5d6-4be0-9ceb-26841dfb0d42" />
<img width="1366" height="768" alt="MLFQ1" src="https://github.com/user-attachments/assets/c85cf7a1-81de-4f32-b17a-f0ba969d2b09" />)

---

## Sample Input

| Process | Arrival Time | Burst Time |
|---------|--------------|------------|
| P1      | 2            | 1          |
| P2      | 4            | 2          |
| P3      | 6            | 3          |
| P4      | 8            | 4          |
| P5      | 10           | 5          |

---

## Sample Output (FCFS)

Gantt Chart:
| P1 | P2 | P3 | P4 | P5 |

Metrics Table:
PID | Arrival | Burst | Start | Finish | Waiting | Turnaround
P1  | 2       | 1     | 2     | 3      | 0       | 1
P2  | 4       | 2     | 4     | 6      | 0       | 2
P3  | 6       | 3     | 6     | 9      | 0       | 3
P4  | 8       | 4     | 9     | 13     | 1       | 5
P5  | 10      | 5     | 13    | 18     | 3       | 8

Average Waiting Time: 0.80
Average Turnaround Time: 3.80

## Team Contributions

| Member         | Role                        |
|----------------|-----------------------------|
| Owen Robert S. Magsayo | Java backend implementation |
| Pantine B. Hernando| Java backend implementation & Web GUI |
