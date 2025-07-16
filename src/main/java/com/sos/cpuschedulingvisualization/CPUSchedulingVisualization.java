/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Owen
 * 
 */
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

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
