/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Nitro-5
 */
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
public class MLFQScheduler {
      public static void runMLFQ(List<Process> processList, int[] quantums, int[] allotments) {
        int time = 0;
        int completed = 0;
        int n = processList.size();

        List<Process> processes = new ArrayList<>();
        for (Process p : processList) {
            processes.add(new Process(p.pid, p.arrivalTime, p.burstTime));
        }

        Queue<Process>[] queues = new LinkedList[4];
        for (int i = 0; i < 4; i++) queues[i] = new LinkedList<>();

        StringBuilder gantt = new StringBuilder("Gantt Chart:\n|");
        Process current = null;
        int currentQuantum = 0;
        int currentAllotment = 0;
        int currentLevel = 0;

        while (completed < n) {
            for (Process p : processes) {
                if (p.arrivalTime == time) {
                    queues[0].add(p);
                }
            }

            if (current != null && current.remainingTime == 0) {
                current.completionTime = time;
                completed++;
                current = null;
            }

            if (current != null && currentQuantum == 0) {
                if (currentLevel < 3 && currentAllotment >= allotments[currentLevel]) {
                    queues[currentLevel + 1].add(current);
                } else {
                    queues[currentLevel].add(current);
                }
                current = null;
            }

            if (current == null) {
                for (int i = 0; i < 4; i++) {
                    if (!queues[i].isEmpty()) {
                        current = queues[i].poll();
                        currentLevel = i;
                        currentQuantum = (i == 3) ? Integer.MAX_VALUE : quantums[i];
                        currentAllotment = 0;
                        if (current.startTime == -1) {
                            current.startTime = time;
                            current.responseTime = time - current.arrivalTime;
                        }
                        break;
                    }
                }
            }

            if (current != null) {
                gantt.append(String.format(" Q%d:P%d |", currentLevel, current.pid));
                current.remainingTime--;
                currentQuantum--;
                currentAllotment++;
            } else {
                gantt.append(" IDLE |");
            }

            time++;
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

