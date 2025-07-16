/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.sos.cpuschedulingvisualization;

/**
 *
 * @author Nitro-5
 */
public class Process {
    public final int pid;
    public int arrivalTime;
    public int burstTime;
    public int completionTime;
    public int turnaroundTime;
    public int waitingTime;
    public int responseTime;
    public int startTime;
    public int remainingTime;

    public Process(int pid, int arrivalTime, int burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.startTime = -1;
    }
}

