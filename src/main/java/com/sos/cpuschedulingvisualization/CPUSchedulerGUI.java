/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/javafx/FXMain.java to edit this template
 */

import javafx.application.Application;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

/**
 *
 * @author Owen
 */

public class CPUSchedulingVisualization extends Application {
    
    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Process Scheduler");

        // Containers
        VBox mainLayout = new VBox(10);
        mainLayout.setPadding(new Insets(10));

        // Process Information Section
        HBox processInfo = new HBox(10);
        VBox leftColumn = new VBox(10);
        VBox rightColumn = new VBox(10);

        // Left Column
        ComboBox<String> processName = new ComboBox<>();
        processName.getItems().addAll("Process1", "Process2");
        TextField executionTime = new TextField();
        TextField arrivalTime = new TextField();
        TextField priority = new TextField();
        Button updateButton = new Button("Update");

        leftColumn.getChildren().addAll(
                new Label("Name"), processName,
                new Label("Arrival Time"), arrivalTime,
                new Label("Exec. Time"), executionTime,
                new Label("Priority"), priority,
                updateButton
        );

        // Right Column
        TableView<TableRowData> processTable = new TableView<>();
        processTable.getColumns().addAll(createProcessColumn(), createExecutionColumn());

        rightColumn.getChildren().addAll(new Label("Process"), processTable);

        processInfo.getChildren().addAll(leftColumn, rightColumn);

        // Algorithm Section
        HBox algorithmSection = new HBox(10);
        ComboBox<String> algorithmCombo = new ComboBox<>();
        algorithmCombo.getItems().addAll("Round Robin", "FCFS");
        Slider timeQuantum = new Slider(1, 10, 1);
        Label actionMessage = new Label("No Errors.");

        algorithmSection.getChildren().addAll(
                new Label("Algorithm"), algorithmCombo,
                new Label("Time Quantum for Round Rob."), timeQuantum,
                actionMessage
        );

        // Statistics Section
        HBox statsSection = new HBox(10);
        statsSection.getChildren().addAll(createStatColumn("Average Waiting Time"),
                createStatColumn("Average Execution Time"), createStatColumn("Total Execution Time"));

        // Gantt Chart Section
        VBox ganttChartSection = new VBox(10);
        TextArea ganttChartArea = new TextArea();
        ganttChartArea.setPrefHeight(100);
        ganttChartArea.setPromptText("Gantt Chart");

        ganttChartSection.getChildren().addAll(
                new Label("Gantt Chart (Each box represents a second)"), ganttChartArea
        );

        // Main Button Section
        HBox buttonSection = new HBox(10);
        buttonSection.getChildren().addAll(
                new Button("Simulate"),
                new Button("Reset All")
        );

        // Assemble Main Layout
        mainLayout.getChildren().addAll(processInfo, algorithmSection, statsSection, ganttChartSection, buttonSection);
        Scene scene = new Scene(mainLayout, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private TableColumn<TableRowData, String> createProcessColumn() {
        TableColumn<TableRowData, String> processColumn = new TableColumn<>("Process");
        processColumn.setCellValueFactory(data -> data.getValue().processNameProperty());
        return processColumn;
    }

    private TableColumn<TableRowData, Integer> createExecutionColumn() {
        TableColumn<TableRowData, Integer> executionColumn = new TableColumn<>("Exec. Time");
        executionColumn.setCellValueFactory(data -> data.getValue().executionTimeProperty());
        return executionColumn;
    }

    private VBox createStatColumn(String label) {
        VBox column = new VBox(5);
        Label statLabel = new Label(label);
        Label statValue = new Label(": -");
        column.getChildren().addAll(statLabel, statValue);
        return column;
    }

    public static void main(String[] args) {
        launch(args);
    }

    // Inner class for table row data
    public static class TableRowData {
        private final SimpleStringProperty processName;
        private final SimpleIntegerProperty executionTime;

        public TableRowData(String processName, int executionTime) {
            this.processName = new SimpleStringProperty(processName);
            this.executionTime = new SimpleIntegerProperty(executionTime);
        }

        public SimpleStringProperty processNameProperty() {
            return processName;
        }

        public SimpleIntegerProperty executionTimeProperty() {
            return executionTime;
        }
    }
}


    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }
    
}
import javafx.application.Application;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleStringProperty;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

/**
 *
 * @author HP
 */

public class CPUSchedulingVisualization extends Application {
    
    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Process Scheduler");

        // Containers
        VBox mainLayout = new VBox(10);
        mainLayout.setPadding(new Insets(10));

        // Process Information Section
        HBox processInfo = new HBox(10);
        VBox leftColumn = new VBox(10);
        VBox rightColumn = new VBox(10);

        // Left Column
        ComboBox<String> processName = new ComboBox<>();
        processName.getItems().addAll("Process1", "Process2");
        TextField executionTime = new TextField();
        TextField arrivalTime = new TextField();
        TextField priority = new TextField();
        Button updateButton = new Button("Update");

        leftColumn.getChildren().addAll(
                new Label("Name"), processName,
                new Label("Arrival Time"), arrivalTime,
                new Label("Exec. Time"), executionTime,
                new Label("Priority"), priority,
                updateButton
        );

        // Right Column
        TableView<TableRowData> processTable = new TableView<>();
        processTable.getColumns().addAll(createProcessColumn(), createExecutionColumn());

        rightColumn.getChildren().addAll(new Label("Process"), processTable);

        processInfo.getChildren().addAll(leftColumn, rightColumn);

        // Algorithm Section
        HBox algorithmSection = new HBox(10);
        ComboBox<String> algorithmCombo = new ComboBox<>();
        algorithmCombo.getItems().addAll("Round Robin", "FCFS");
        Slider timeQuantum = new Slider(1, 10, 1);
        Label actionMessage = new Label("No Errors.");

        algorithmSection.getChildren().addAll(
                new Label("Algorithm"), algorithmCombo,
                new Label("Time Quantum for Round Rob."), timeQuantum,
                actionMessage
        );

        // Statistics Section
        HBox statsSection = new HBox(10);
        statsSection.getChildren().addAll(createStatColumn("Average Waiting Time"),
                createStatColumn("Average Execution Time"), createStatColumn("Total Execution Time"));

        // Gantt Chart Section
        VBox ganttChartSection = new VBox(10);
        TextArea ganttChartArea = new TextArea();
        ganttChartArea.setPrefHeight(100);
        ganttChartArea.setPromptText("Gantt Chart");

        ganttChartSection.getChildren().addAll(
                new Label("Gantt Chart (Each box represents a second)"), ganttChartArea
        );

        // Main Button Section
        HBox buttonSection = new HBox(10);
        buttonSection.getChildren().addAll(
                new Button("Simulate"),
                new Button("Reset All")
        );

        // Assemble Main Layout
        mainLayout.getChildren().addAll(processInfo, algorithmSection, statsSection, ganttChartSection, buttonSection);
        Scene scene = new Scene(mainLayout, 800, 600);
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private TableColumn<TableRowData, String> createProcessColumn() {
        TableColumn<TableRowData, String> processColumn = new TableColumn<>("Process");
        processColumn.setCellValueFactory(data -> data.getValue().processNameProperty());
        return processColumn;
    }

    private TableColumn<TableRowData, Integer> createExecutionColumn() {
        TableColumn<TableRowData, Integer> executionColumn = new TableColumn<>("Exec. Time");
        executionColumn.setCellValueFactory(data -> data.getValue().executionTimeProperty());
        return executionColumn;
    }

    private VBox createStatColumn(String label) {
        VBox column = new VBox(5);
        Label statLabel = new Label(label);
        Label statValue = new Label(": -");
        column.getChildren().addAll(statLabel, statValue);
        return column;
    }

    public static void main(String[] args) {
        launch(args);
    }

    // Inner class for table row data
    public static class TableRowData {
        private final SimpleStringProperty processName;
        private final SimpleIntegerProperty executionTime;

        public TableRowData(String processName, int executionTime) {
            this.processName = new SimpleStringProperty(processName);
            this.executionTime = new SimpleIntegerProperty(executionTime);
        }

        public SimpleStringProperty processNameProperty() {
            return processName;
        }

        public SimpleIntegerProperty executionTimeProperty() {
            return executionTime;
        }
    }
}


    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }
    
}
