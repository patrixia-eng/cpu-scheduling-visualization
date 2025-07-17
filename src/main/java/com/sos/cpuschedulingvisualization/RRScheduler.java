/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sos.cpuschedulingvisualization;

/**
 *
 * @author MAGSAYO_HERNANDO
 */
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class RRScheduler {
     public static void runRR(List<Process> processList, int quantum) {
        int time = 0;
        int completed = 0;
        int n = processList.size();

        Queue<Process> queue = new LinkedList<>();
        List<Process> processes = new ArrayList<>();
        for (Process p : processList) {
            processes.add(new Process(p.pid, p.arrivalTime, p.burstTime));
        }

        boolean[] isInQueue = new boolean[n];
        StringBuilder gantt = new StringBuilder("Gantt Chart:\n|");

        while (completed < n) {
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (p.arrivalTime == time && !isInQueue[i]) {
                    queue.add(p);
                    isInQueue[i] = true;
                }
            }

            if (queue.isEmpty()) {
                gantt.append(" IDLE |");
                time++;
                continue;
            }

            Process current = queue.poll();
            if (current.startTime == -1) {
                current.startTime = time;
                current.responseTime = time - current.arrivalTime;
            }

            int execTime = Math.min(quantum, current.remainingTime);
            for (int t = 0; t < execTime; t++) {
                gantt.append(String.format(" P%d |", current.pid));
                time++;

                for (int i = 0; i < n; i++) {
                    Process p = processes.get(i);
                    if (p.arrivalTime == time && !isInQueue[i]) {
                        queue.add(p);
                        isInQueue[i] = true;
                    }
                }
            }

            current.remainingTime -= execTime;
            if (current.remainingTime == 0) {
                current.completionTime = time;
                completed++;
            } else {
                queue.add(current);
            }
        }

        double totalTAT = 0, totalWT = 0, totalRT = 0;
        System.out.println(gantt + "\n");
        System.out.println("PID\tAT\tBT\tCT\tTAT\tWT\tRT");
        for (Process p : processes) {
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            totalTAT += p.turnaroundTime;
            totalWT += p.waitingTime;
            totalRT += p.responseTime;

            System.out.printf("P%d\t%d\t%d\t%d\t%d\t%d\t%d\n",
                    p.pid, p.arrivalTime, p.burstTime,
                    p.completionTime, p.turnaroundTime,
                    p.waitingTime, p.responseTime);
        }

        System.out.printf("\nAverage Turnaround Time: %.2f\n", totalTAT / n);
        System.out.printf("Average Waiting Time   : %.2f\n", totalWT / n);
        System.out.printf("Average Response Time  : %.2f\n", totalRT / n);
    }
}
