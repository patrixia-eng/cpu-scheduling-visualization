/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sos.cpuschedulingvisualization;

/**
 *
 * @author MAGSAYO_HERNANDO
 */import java.util.*;
public class SJFScheduler {
     
public static void runSJF(List<Process> processes) {
        int n = processes.size();
        boolean[] isCompleted = new boolean[n];
        int completed = 0;
        int currentTime = 0;

        int totalTAT = 0, totalWT = 0, totalRT = 0;

        StringBuilder gantt = new StringBuilder("\nGantt Chart:\n|");

        while (completed < n) {
            int idx = -1;
            int minBurst = Integer.MAX_VALUE;

            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (p.arrivalTime <= currentTime && !isCompleted[i]) {
                    if (p.burstTime < minBurst) {
                        minBurst = p.burstTime;
                        idx = i;
                    } else if (p.burstTime == minBurst && p.arrivalTime < processes.get(idx).arrivalTime) {
                        idx = i;
                    }
                }
            }

            if (idx != -1) {
                Process p = processes.get(idx);
                p.responseTime = currentTime - p.arrivalTime;
                currentTime += p.burstTime;
                p.completionTime = currentTime;
                p.turnaroundTime = p.completionTime - p.arrivalTime;
                p.waitingTime = p.turnaroundTime - p.burstTime;

                isCompleted[idx] = true;
                completed++;

                totalTAT += p.turnaroundTime;
                totalWT += p.waitingTime;
                totalRT += p.responseTime;

                gantt.append(" P").append(p.pid).append(" |");
            } else {
                gantt.append(" IDLE |");
                currentTime++;
            }
        }

        System.out.println(gantt.toString());
        System.out.println("\nPID\tAT\tBT\tCT\tTAT\tWT\tRT");
        for (Process p : processes) {
            System.out.printf("P%d\t%d\t%d\t%d\t%d\t%d\t%d\n",
                    p.pid, p.arrivalTime, p.burstTime, p.completionTime,
                    p.turnaroundTime, p.waitingTime, p.responseTime);
        }

        System.out.printf("\nAverage Turnaround Time: %.2f\n", totalTAT / (float) n);
        System.out.printf("Average Waiting Time   : %.2f\n", totalWT / (float) n);
        System.out.printf("Average Response Time  : %.2f\n", totalRT / (float) n);
    }
}
