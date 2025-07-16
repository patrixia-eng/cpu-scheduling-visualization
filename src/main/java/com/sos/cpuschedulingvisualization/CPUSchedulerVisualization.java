/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.mycompany.cpuschedulingvisualization;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Random;
import java.util.Scanner;

/**
 *
 * @author Owen
 */

class Process {
    int id, arrivalTime, burstTime, completionTime, turnaroundTime, waitingTime, responseTime, remainingTime;
    boolean started = false;

    public Process(int id, int arrivalTime, int burstTime) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
    }
}

public class CPUSchedulingVisualization {
    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("CPU Scheduling Simulation");
        List<Process> processes = new ArrayList<>();

        System.out.print("Enter number of processes: ");
        int n = sc.nextInt();

        System.out.print("Manual input or Random generation? (M/R): ");
        char choice = sc.next().toUpperCase().charAt(0);

        if (choice == 'M') {
            for (int i = 0; i < n; i++) {
                System.out.print("Enter arrival time for P" + i + ": ");
                int at = sc.nextInt();
                System.out.print("Enter burst time for P" + i + ": ");
                int bt = sc.nextInt();
                processes.add(new Process(i, at, bt));
            }
        } else {
            Random rand = new Random();
            for (int i = 0; i < n; i++) {
                int at = rand.nextInt(10);
                int bt = rand.nextInt(9) + 1;
                processes.add(new Process(i, at, bt));
                System.out.println("Generated P" + i + " AT: " + at + ", BT: " + bt);
            }
        }

        System.out.println("Select Scheduling Algorithm:");
        System.out.println("1. FCFS\n2. SJF\n3. SRTF\n4. Round Robin\n5. MLFQ");
        int algo = sc.nextInt();

        switch (algo) {
            case 1:
                fcfs(processes);
                break;
            case 2:
                sjf(processes);
                break;
            case 3:
                srtf(processes);
                break;
            case 4:
                System.out.print("Enter Time Quantum: ");
                int quantum = sc.nextInt();
                roundRobin(processes, quantum);
                break;
            case 5:
                int[] quanta = new int[4];
                for (int i = 0; i < 4; i++) {
                    System.out.print("Enter time quantum for Q" + i + ": ");
                    quanta[i] = sc.nextInt();
                }
                mlfq(processes, quanta);
                break;
            default:
                System.out.println("Invalid choice.");
        }
    }

    static void fcfs(List<Process> plist) {
        plist.sort(Comparator.comparingInt(p -> p.arrivalTime));
        int currentTime = 0;
        StringBuilder gantt = new StringBuilder("Gantt Chart:\n");

        for (Process p : plist) {
            if (currentTime < p.arrivalTime)
                currentTime = p.arrivalTime;

            p.responseTime = currentTime - p.arrivalTime;
            currentTime += p.burstTime;
            p.completionTime = currentTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            gantt.append("| P").append(p.id).append(" ");
        }
        gantt.append("|\n");
        displayResults(plist, gantt.toString());
    }

    static void sjf(List<Process> plist) {
        int currentTime = 0;
        int completed = 0;
        StringBuilder gantt = new StringBuilder("Gantt Chart:\n");
        boolean[] visited = new boolean[plist.size()];

        while (completed < plist.size()) {
            int idx = -1;
            int minBT = Integer.MAX_VALUE;

            for (int i = 0; i < plist.size(); i++) {
                Process p = plist.get(i);
                if (p.arrivalTime <= currentTime && !visited[i] && p.burstTime < minBT) {
                    minBT = p.burstTime;
                    idx = i;
                }
            }

            if (idx == -1) {
                currentTime++;
                continue;
            }

            Process p = plist.get(idx);
            p.responseTime = currentTime - p.arrivalTime;
            currentTime += p.burstTime;
            p.completionTime = currentTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            visited[idx] = true;
            completed++;
            gantt.append("| P").append(p.id).append(" ");
        }
        gantt.append("|\n");
        displayResults(plist, gantt.toString());
    }

    static void srtf(List<Process> plist) {
        int n = plist.size();
        int completed = 0, currentTime = 0;
        StringBuilder gantt = new StringBuilder("Gantt Chart:\n");
        Process prev = null;

        while (completed < n) {
            int idx = -1, minRem = Integer.MAX_VALUE;

            for (int i = 0; i < n; i++) {
                Process p = plist.get(i);
                if (p.arrivalTime <= currentTime && p.remainingTime > 0 && p.remainingTime < minRem) {
                    minRem = p.remainingTime;
                    idx = i;
                }
            }

            if (idx == -1) {
                currentTime++;
                continue;
            }

            Process p = plist.get(idx);
            if (!p.started) {
                p.responseTime = currentTime - p.arrivalTime;
                p.started = true;
            }
            if (prev == null || prev.id != p.id) gantt.append("| P").append(p.id).append(" ");
            p.remainingTime--;
            currentTime++;
            if (p.remainingTime == 0) {
                p.completionTime = currentTime;
                p.turnaroundTime = p.completionTime - p.arrivalTime;
                p.waitingTime = p.turnaroundTime - p.burstTime;
                completed++;
            }
            prev = p;
        }
        gantt.append("|\n");
        displayResults(plist, gantt.toString());
    }

    static void roundRobin(List<Process> plist, int quantum) {
        Queue<Process> queue = new LinkedList<>();
        int currentTime = 0;
        int completed = 0;
        boolean[] visited = new boolean[plist.size()];
        StringBuilder gantt = new StringBuilder("Gantt Chart:\n");

        while (completed < plist.size()) {
            for (int i = 0; i < plist.size(); i++) {
                Process p = plist.get(i);
                if (!visited[i] && p.arrivalTime <= currentTime) {
                    queue.offer(p);
                    visited[i] = true;
                }
            }

            if (queue.isEmpty()) {
                currentTime++;
                continue;
            }

            Process p = queue.poll();
            if (!p.started) {
                p.responseTime = currentTime - p.arrivalTime;
                p.started = true;
            }
            gantt.append("| P").append(p.id).append(" ");
            int execTime = Math.min(quantum, p.remainingTime);
            currentTime += execTime;
            p.remainingTime -= execTime;

            for (int i = 0; i < plist.size(); i++) {
                Process np = plist.get(i);
                if (!visited[i] && np.arrivalTime <= currentTime) {
                    queue.offer(np);
                    visited[i] = true;
                }
            }

            if (p.remainingTime > 0) queue.offer(p);
            else {
                p.completionTime = currentTime;
                p.turnaroundTime = p.completionTime - p.arrivalTime;
                p.waitingTime = p.turnaroundTime - p.burstTime;
                completed++;
            }
        }
        gantt.append("|\n");
        displayResults(plist, gantt.toString());
    }

    static void mlfq(List<Process> plist, int[] quanta) {
        int currentTime = 0, completed = 0;
        int levels = 4;
        List<Queue<Process>> queues = new ArrayList<>();
        boolean[] visited = new boolean[plist.size()];
        StringBuilder gantt = new StringBuilder("Gantt Chart:\n");

        for (int i = 0; i < levels; i++) queues.add(new LinkedList<>());

        while (completed < plist.size()) {
            for (int i = 0; i < plist.size(); i++) {
                if (!visited[i] && plist.get(i).arrivalTime <= currentTime) {
                    queues.get(0).offer(plist.get(i));
                    visited[i] = true;
                }
            }

            Process p = null;
            int qLevel = -1;
            for (int i = 0; i < levels; i++) {
                if (!queues.get(i).isEmpty()) {
                    p = queues.get(i).poll();
                    qLevel = i;
                    break;
                }
            }

            if (p == null) {
                currentTime++;
                continue;
            }

            if (!p.started) {
                p.responseTime = currentTime - p.arrivalTime;
                p.started = true;
            }

            gantt.append("| P").append(p.id).append("(Q").append(qLevel).append(") ");

            int execTime = Math.min(quanta[qLevel], p.remainingTime);
            currentTime += execTime;
            p.remainingTime -= execTime;

            for (int i = 0; i < plist.size(); i++) {
                if (!visited[i] && plist.get(i).arrivalTime <= currentTime) {
                    queues.get(0).offer(plist.get(i));
                    visited[i] = true;
                }
            }

            if (p.remainingTime == 0) {
                p.completionTime = currentTime;
                p.turnaroundTime = p.completionTime - p.arrivalTime;
                p.waitingTime = p.turnaroundTime - p.burstTime;
                completed++;
            } else {
                if (qLevel + 1 < levels)
                    queues.get(qLevel + 1).offer(p);
                else
                    queues.get(qLevel).offer(p);
            }
        }
        gantt.append("|\n");
        displayResults(plist, gantt.toString());
    }

    static void displayResults(List<Process> plist, String ganttChart) {
        double totalTAT = 0, totalRT = 0;
        System.out.println(ganttChart);
        System.out.println("ID\tAT\tBT\tCT\tTAT\tRT");
        for (Process p : plist) {
            System.out.printf("P%d\t%d\t%d\t%d\t%d\t%d\n", p.id, p.arrivalTime, p.burstTime, p.completionTime, p.turnaroundTime, p.responseTime);
            totalTAT += p.turnaroundTime;
            totalRT += p.responseTime;
        }
        System.out.printf("Average Turnaround Time: %.2f\n", totalTAT / plist.size());
        System.out.printf("Average Response Time: %.2f\n", totalRT / plist.size());
    }
}
