/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Nitro-5
 */import java.util.*;
public class SJFScheduler {
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
