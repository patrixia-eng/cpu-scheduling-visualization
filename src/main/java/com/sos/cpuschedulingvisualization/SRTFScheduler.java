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
import java.util.List;
public class SRTFScheduler {
     public static void runSRTF(List<Process> processList) {
        int n = processList.size();
        int completed = 0, time = 0, prev = -1;
        List<Process> processes = new ArrayList<>();
        for (Process p : processList) {
            Process np = new Process(p.pid, p.arrivalTime, p.burstTime);
            np.remainingTime = p.burstTime;
            np.startTime = -1;
            np.completionTime = 0;
            np.responseTime = 0;
            np.turnaroundTime = 0;
            np.waitingTime = 0;
            processes.add(np);
        }

        StringBuilder gantt = new StringBuilder("Gantt Chart:\n|");

        while (completed < n) {
            int idx = -1;
            int minRT = Integer.MAX_VALUE;
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (p.arrivalTime <= time && p.remainingTime > 0) {
                    if (p.remainingTime < minRT) {
                        minRT = p.remainingTime;
                        idx = i;
                    }
                }
            }
            if (idx != -1) {
                Process current = processes.get(idx);
                if (current.startTime == -1) {
                    current.startTime = time;
                    current.responseTime = time - current.arrivalTime;
                }
                current.remainingTime--;
                gantt.append(" P").append(current.pid).append(" |");
                if (current.remainingTime == 0) {
                    current.completionTime = time + 1;
                    completed++;
                }
            } else {
                gantt.append(" IDLE |");
            }
            time++;
        }

        double totalTAT = 0, totalWT = 0, totalRT = 0;
        System.out.println(gantt);
        System.out.println("\nPID\tAT\tBT\tCT\tTAT\tWT\tRT");
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
