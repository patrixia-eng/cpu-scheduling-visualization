/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Nitro-5
 * i
 */
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;


public class CPUSchedulingVisualization {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Process> processes = new ArrayList<>();

        System.out.print("Enter number of processes: ");
        int n = sc.nextInt();

        for (int i = 0; i < n; i++) {
           System.out.println("Enter details for Process " + (i + 1));
            System.out.print("Arrival Time: ");
            int at = sc.nextInt();
            System.out.print("Burst Time: ");
            int bt = sc.nextInt();
            processes.add(new Process  (i + 1, at, bt));   
        }  
        System.out.println("Choose Scheduling Algorithm:"); 
        System.out.println("1. FCFS");
        System.out.print("2. SJF");
        System.out.println("3. SRTF");
        System.out.println("4. Round Robin");
        System.out.println("5. MLFQ");
        int choice = sc.nextInt();

        switch (choice) {
            case 1 -> FCFSScheduler.runFCFS(processes);
            case 2 -> SJFScheduler.runSJF(processes);
            case 3 -> SRTFScheduler.runSRTF(processes);
            case 4 -> {
                System.out.print("Enter time quantum: ");
                int quantum = sc.nextInt();
                RRScheduler.runRR(processes, quantum);
            }
            case 5 -> {
                int levels = 4;
                int[] quantums = new int[levels];
                int[] allotments = new int[levels - 1];

                System.out.println("Enter Time Quantums for MLFQ (Q0 to Q2, Q3 is FCFS):");
                for (int i = 0; i < levels - 1; i++) {
                    System.out.print("Quantum for Q" + i + ": ");
                    quantums[i] = sc.nextInt();
                    System.out.print("Allotment for Q" + i + ": ");
                    allotments[i] = sc.nextInt();
                }
                quantums[levels - 1] = Integer.MAX_VALUE; // FCFS for last queue

                MLFQScheduler.runMLFQ(processes, quantums, allotments);
            }
            default -> System.out.println("Invalid choice.");
        }
        sc.close();
    }
}


