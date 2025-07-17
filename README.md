# CPU Scheduling Visualization

### Operating Systems – Project 01

This is a console-based simulation program that demonstrates how various CPU scheduling algorithms work. It allows the user to input processes manually and visualize how the CPU scheduler handles each process.

---

## Features

- Simulates **5 major CPU Scheduling algorithms**:
  1. First-Come First-Served (FCFS / FIFO)
  2. Shortest Job First (SJF - Non-Preemptive)
  3. Shortest Remaining Time First (SRTF - Preemptive)
  4. Round Robin (RR)
  5. Multilevel Feedback Queue (MLFQ)

- **User Options:**
  - Manually enter process details (Arrival Time & Burst Time)
  - Choose a scheduling algorithm to simulate
  - Enter custom Time Quantum(s) for RR and MLFQ

- **Visual Output:**
  - ASCII-based Gantt Chart
  - Process Metrics:
    - Arrival Time
    - Burst Time
    - Completion Time
    - Turnaround Time
    - Response Time
  - Averages for Turnaround and Response Time

- **MLFQ Output Includes:**
  - Process priority level shown in Gantt chart
  - 4 levels of priority: Q0 (highest) to Q3 (lowest)
  - Custom time slices and allotment per queue

---

## How to Run

1. Clone the repository or download the `.java` files.
2. Open the project in **NetBeans** or any Java IDE.
3. Compile and run the main class.
4. Follow on-screen prompts to input process data and select the desired scheduling algorithm.

---

## Example Output

```text
Gantt Chart:
| P1 | P2 | P3 |

PID	AT	BT	CT	TAT	RT
P1	0	5	5	5	0
P2	1	3	8	7	2
P3	2	1	9	7	6

Average Turnaround Time: 6.33
Average Response Time: 2.67
