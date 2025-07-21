# CPU Scheduling Visualization

### Operating Systems – Project 01

## Overview

This project is a simulation and visualization tool for various **CPU scheduling algorithms**, built as part of an Operating Systems course requirement. The goal is to help students and users understand how different CPU scheduling policies work by providing a visual representation of process executions, time calculations, and comparisons.

Developed with **Java (Terminal/console)** and **JavaScript HTML (GUI)** version.

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

1. Open `index.html` in browser.
2. Enter number of processes.
3. Fill in **Process ID**, **Arrival Time**, and **Burst Time**.
4. Select the desired scheduling algorithm.
5. Configure time quantum (for RR and MLFQ).
6. Click **Run Simulation**.

### Console Version (Java)

1. Open the Java project in Visual Studio Code or NetBeans.
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

## Backend (Terminal/Console) Screenshots

### FCFS Simulation Example
![FCFS](https://github.com/user-attachments/assets/f12a8993-1e22-44c5-ad92-6991ca92aad4)

### SJF Simulation Example
![SJF](https://github.com/user-attachments/assets/c615e7c5-691c-489d-8944-56e7f7266b00)

### SRTF Simulation Example
![SRTF](https://github.com/user-attachments/assets/9978a014-be59-408d-add0-688fe65ec287)

### RR Simulation Example
![RR](https://github.com/user-attachments/assets/7840e162-b9bc-446e-bc3f-22e998a1924f)
![RR Results](https://github.com/user-attachments/assets/0e65b72b-7d8b-4aea-a2b7-f99f7824a6b7)

### MLFQ Simulation Example
![MLFQ](https://github.com/user-attachments/assets/1a81f9d3-3185-4ca7-880a-c430a2783c52)
![MLFQ Results](https://github.com/user-attachments/assets/24d6a126-deec-434d-a705-93ca5b013784)

---

## Frontend GUI Screenshots

### FCFS Simulation Example
<img width="503" height="762" alt="FCFS" src="https://github.com/user-attachments/assets/8643909f-6727-4d1f-a929-119e47f4d59b" />

### SJF Simulation Example
<img width="521" height="759" alt="SJF" src="https://github.com/user-attachments/assets/1f3d0645-5189-426c-b766-11f37600016d" />

### SRTF Simulation Example
<img width="521" height="767" alt="SRTF" src="https://github.com/user-attachments/assets/c57aa1ec-17d6-4cf7-a86f-6153feb940de" />

### RR Simulation Example
<img width="513" height="767" alt="RR" src="https://github.com/user-attachments/assets/2cd4ca83-14d1-4143-968d-aeb1919a6632" />

### MLFQ Simulation Example
<img width="522" height="698" alt="MLFQ Input" src="https://github.com/user-attachments/assets/762986f0-c1d5-4323-9fe0-30a650af3781" />
<img width="588" height="394" alt="MLFQ Result" src="https://github.com/user-attachments/assets/cdedcdc0-fdbe-4476-b716-7f78acd63bee" />

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

### Gantt Chart:
| P1 | P2 | P3 | P4 | P5 |

### Metrics Table:

| PID | Arrival | Burst | Completion | Turnaround | Response |
|-----|---------|-------|------------|------------|----------|
| P1  | 2       | 1     | 3          | 1          | 0        |
| P2  | 4       | 2     | 6          | 2          | 0        |
| P3  | 6       | 3     | 9          | 3          | 0        |
| P4  | 8       | 4     | 13         | 5          | 1        |
| P5  | 10      | 5     | 18         | 8          | 3        |

Average Completion Time: 9.80
Average Turnaround Time: 3.80
Average Response Time: 0.80

## Team Contributions

| Member                     | Roles & Responsibilities                                                                                                                                                                                              |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pantine B. Hernando**    | - Led frontend design and implementation of Web GUI.<br>- Developed core backend logic for SRTF, RR, and MLFQ algorithms.<br>- Managed project structure and repository organization.                                      |
| **Owen Robert S. Magsayo** | - Contributed to Java backend development, including FCFS and SJF algorithms.<br>- Helped develop JavaScript logic in the Web GUI.<br>- Assisted in debugging and integration of frontend with backend. |
