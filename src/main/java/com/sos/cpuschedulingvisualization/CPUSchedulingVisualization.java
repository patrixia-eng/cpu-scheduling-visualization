/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Nitro-5
 */

class Process {
    int pid;
    int arrivalTime;
    int burstTime;
    int completionTime;
    int turnaroundTime;
    int responseTime;

    public Process(int pid, int arrivalTime, int burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
    }
}

public class CPUSchedulingVisualization {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Process> processes = new ArrayList<>();

        System.out.print("Enter number of processes: ");
        int n = sc.nextInt();

        for (int i = 0; i < n; i++) {
            System.out.println("Process " + i + ":");
            System.out.print("Arrival Time: ");
            int at = sc.nextInt();
            System.out.print("Burst Time: ");
            int bt = sc.nextInt();
            processes.add(new Process(i, at, bt));
        }

        fcfs(processes);
    }

    public static void fcfs(List<Process> processes) {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        int currentTime = 0;
        int totalTAT = 0;
        int totalRT = 0;

        System.out.println("\nGantt Chart:");
        for (Process p : processes) {
            if (currentTime < p.arrivalTime) {
                currentTime = p.arrivalTime;
            }
            p.responseTime = currentTime - p.arrivalTime;
            p.completionTime = currentTime + p.burstTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;

            totalTAT += p.turnaroundTime;
            totalRT += p.responseTime;

            System.out.print("| P" + p.pid + " ");
            currentTime = p.completionTime;
        }
        System.out.println("|");

        currentTime = 0;
        for (Process p : processes) {
            if (currentTime < p.arrivalTime) {
                currentTime = p.arrivalTime;
            }
            System.out.print(currentTime + "    ");
            currentTime += p.burstTime;
        }
        System.out.println(currentTime);

        System.out.printf("\n%-5s%-15s%-12s%-18s%-18s%-15s\n",
                "PID", "Arrival Time", "Burst Time", "Completion Time", "Turnaround Time", "Response Time");
        for (Process p : processes) {
            System.out.printf("%-5d%-15d%-12d%-18d%-18d%-15d\n",
                    p.pid, p.arrivalTime, p.burstTime, p.completionTime, p.turnaroundTime, p.responseTime);
        }

        System.out.printf("\nAverage Turnaround Time: %.2f\n", totalTAT / (double) processes.size());
        System.out.printf("Average Response Time: %.2f\n", totalRT / (double) processes.size());
    }
}
