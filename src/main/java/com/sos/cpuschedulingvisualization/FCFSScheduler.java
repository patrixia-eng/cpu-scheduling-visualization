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
    public static void runFCFS(List<Process> processes) {
        processes.sort(Comparator.comparingInt(p -> p.arrivalTime));

        int currentTime = 0;
        int totalTAT = 0, totalWT = 0, totalRT = 0;

        System.out.println("\nGantt Chart:");
        for (Process p : processes) {
            if (currentTime < p.arrivalTime) {
                currentTime = p.arrivalTime;
            }

            p.responseTime = currentTime - p.arrivalTime;
            p.completionTime = currentTime + p.burstTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;

            currentTime = p.completionTime;

            System.out.print("|  P" + p.pid + "  ");
        }
        System.out.println("|");

        System.out.println("\nPID\tAT\tBT\tCT\tTAT\tWT\tRT");
        for (Process p : processes) {
            System.out.println("P" + p.pid + "\t" + p.arrivalTime + "\t" + p.burstTime + "\t" +
                    p.completionTime + "\t" + p.turnaroundTime + "\t" + p.waitingTime + "\t" + p.responseTime);
            totalTAT += p.turnaroundTime;
            totalWT += p.waitingTime;
            totalRT += p.responseTime;
        }

        int n = processes.size();
        System.out.printf("\nAverage Turnaround Time: %.2f\n", totalTAT / (float) n);
        System.out.printf("Average Waiting Time   : %.2f\n", totalWT / (float) n);
        System.out.printf("Average Response Time  : %.2f\n", totalRT / (float) n);
    }

}
    
