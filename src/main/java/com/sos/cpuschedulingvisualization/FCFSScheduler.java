/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Owen
 */
import java.util.*;
public class FCFSScheduler {
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
