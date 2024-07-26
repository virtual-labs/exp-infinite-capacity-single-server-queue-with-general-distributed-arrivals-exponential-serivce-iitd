//Your JavaScript goes in here
let data;
let options;
let chart;
let chartId;
let rho;
let av_cust_s;
let av_cust_q;
let time;
let cust;
let t_range;
let t_start;
let t_end;
let ar;
let sr;
let av_time_s;
let cust_total;
let av_st;
let currentSimulationType;
let num_wait;

class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

window.onload = function () {
  google.charts.load("current", {
    packages: ["corechart"],
  });

  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    data = google.visualization.arrayToDataTable([
      ["Time", "Customers"],
      [0, 0],
    ]);

    options = {
      title: "No. of Customers in System vs Time",
      width: "100%",
      height: "100%",
      hAxis: {
        title: "Time",
      },
      vAxis: {
        title: "Customers",
      },
      chartArea: { width: "80%", height: "80%" },
      legend: { position: "bottom" },
    };

    chart = new google.visualization.LineChart(
      document.getElementById("chart_div")
    );

    chart.draw(data, options);
  }
};

function check(a, b) {
  if (a == "" || b == "") {
    alert("Values cannot be empty");
    return false;
  }
  if (parseFloat(a) <= 0) {
    alert("Arrival rate should be positive");
    return false;
  }
  if (parseFloat(b) <= 0) {
    alert("Service rate should be positive");
    return false;
  }
  return true;
}
function checkDistribution(val) {
  var element=document.getElementById("par2");
  if(val=="Uniform"){
    element.style.display='block';
  }
  else {
    element.style.display='none';
  }
}

function startSimulation(arrival_rate, service_rate, speed) {
    currentSimulationType = "simulation";
    let valid = check(arrival_rate, service_rate);
    if (!valid) return;
    clearChart();
    // console.log(arrival_rate);
    // console.log(service_rate);
    let sTime = 0;
    let in_use = false;
    if (!arrival_rate) arrival_rate = 1.0;
    if (!service_rate) service_rate = 1.0;
    rho = parseFloat(arrival_rate) / parseFloat(service_rate);
    ar = parseFloat(arrival_rate);
    sr = parseFloat(service_rate);
    let U = Math.random();
    let nextTime = -Math.log(U) / ar;
    let q = new Queue();
    chartId = setInterval(function () {
        // Departure
        if (in_use && sTime < nextTime) {
            av_cust_s += cust * (sTime - time);
            av_cust_q += (cust - 1) * (sTime - time);
            time = sTime;
            data.addRow([time, cust]);
            av_time_s += time - q.dequeue();
            cust--;
            U = Math.random();
            if (cust) {
                sTime = time - Math.log(U) / sr;
                av_st -= Math.log(U) / sr;
            } else in_use = false;
        } 
        // Arrival
        else {
            av_cust_s += cust * (nextTime - time);
            if (cust) av_cust_q += (cust - 1) * (nextTime - time);
            time = nextTime;
            data.addRow([time, cust]);
            q.enqueue(time);
            cust++;
            cust_total++;
            U = Math.random();
            // nextTime is Next arrival time
            nextTime = time - Math.log(U) / ar;
            if (!in_use) {
                in_use = true;
                U = Math.random();
                sTime = time - Math.log(U) / sr;
                av_st -= Math.log(U) / sr;
            } else {
                num_wait += 1;
            }
        }
        data.addRow([time, cust]);
        chart.draw(data, options);
    }, 2010 - speed);
}

function startSimulation1(arrival_rate, service_rate, speed) {
  let valid = check(arrival_rate, service_rate);
  if (!valid) return;     
  clearChart();
  currentSimulationType = "simulation1";
  console.log(arrival_rate);
  console.log(service_rate);
  let sTime = 0;
  let in_use = false;
  if (!arrival_rate) arrival_rate = 1.0;
  if (!service_rate) service_rate = 1.0;
  ar = parseFloat(arrival_rate);
  sr = parseFloat(service_rate);
  rho = ar / sr;
  let U = Math.random();
  let nextTime = 1 / ar;
  let q = new Queue();
  chartId = setInterval(function () {
    if (in_use && sTime < nextTime) {
      av_cust_s += cust * (sTime - time);
      av_cust_q += (cust - 1) * (sTime - time);
      time = sTime;
      data.addRow([time, cust]);
      av_time_s += time - q.dequeue();
      cust--;
      U=Math.random();
      if (cust) {
        sTime = time - Math.log(U) / sr;
        av_st -= Math.log(U) / sr;
      } else in_use = false;
    } else {
      av_cust_s += cust * (nextTime - time);
      if (cust) av_cust_q += (cust - 1) * (nextTime - time);
      time = nextTime;
      data.addRow([time, cust]);
      q.enqueue(time);
      cust++;
      cust_total++;
      nextTime = time + 1 / ar;
      U=Math.random();
      if (!in_use) {
        in_use = true;
        sTime = time - Math.log(U) / sr;
        av_st -= Math.log(U) / sr;
      }

      else{
        num_wait+=1;
      }
    }
    data.addRow([time, cust]);
    chart.draw(data, options);
  }, 2010 - speed);
}

function startSimulation2(param1, param2, service_rate, speed) {
  currentSimulationType = "simulation2";
  param1 = parseFloat(param1);
  param2 = parseFloat(param2);
  variance=((param2-param1)*(param2-param1))/12;
  ar=2/(param1+param2);
  let valid = (check(service_rate, param2-param1) && check(param1,param2));
  if (!valid) return;
  clearChart();
  console.log(param1);
  console.log(param2);
  console.log(service_rate);
  let sTime = 0;
  let in_use = false;
  if (!param1) param1 = 1.0;
  if (!param2) param2 = 2.0;
  if (!service_rate) service_rate = 1.0;
  sr = service_rate;
  rho=ar/sr;
  t_start=param1;
  t_end=param2;
  t_range=param2-param1;
  let U = Math.random();
  let nextTime = (t_start + U * t_range);
  let q = new Queue();
  chartId = setInterval(function () {
    if (in_use && sTime < nextTime) {
      av_cust_s += cust * (sTime - time);
      av_cust_q += (cust - 1) * (sTime - time);
      time = sTime;
      data.addRow([time, cust]);
      av_time_s += time - q.dequeue();
      U = Math.random();
      cust--;
      if (cust) {
        sTime = time - Math.log(U) / sr;
        av_st -= Math.log(U) / sr;
      } else in_use = false;
    } else {
      av_cust_s += cust * (nextTime - time);
      if (cust) av_cust_q += (cust - 1) * (nextTime - time);
      time = nextTime;
      data.addRow([time, cust]);
      q.enqueue(time);
      cust++;
      cust_total++;
      U = Math.random();
      nextTime = time + (t_start + U * t_range);
      if (!in_use) {
        U = Math.random();
        in_use = true;
        sTime = time - Math.log(U) / sr;
        av_st -= Math.log(U) / sr;
      }

      else{
        num_wait+=1;
      }
    }
    data.addRow([time, cust]);
    chart.draw(data, options);
  }, 2010 - speed);
}

function drawTable() {
    document.getElementById("table_div").style.width = "40vw";
    document.getElementById("chart_div").style.width = "40vw";
    chart.draw(data, options);
    document.getElementById("table_div").style.display = "block";

    // console.log(ar);
    // console.log(sr);
    let th_cs = rho / (1 - rho);
    // console.log(th_cs);
    console.log('rho:', rho)
    let ex_cs = av_cust_s / time;
    let th_cq = th_cs * rho;
    let ex_cq = av_cust_q / time;
    let th_ts = th_cs / ar;
    let ex_ts = av_time_s / cust_total;
    let th_st = 1 / sr;
    let ex_st = av_st / (cust_total - cust + 1);
    // Time in queue
    let ex_qt;
    if(num_wait==0) {
        ex_qt = 0.0;
    }
    
    else{
      ex_qt = ex_ts-av_st/cust_total;
    }
    let th_qt = th_cq / ar;
    let chart_data_coll = []
    let exp_times = []
    let exp_data = []
    let theo_data = []
    let lambda_vals = []
    let mu_vals = []

    chart_data_coll.push(data);
    console.log('console_data_coll.length=', chart_data_coll.length);
    exp_times.push(time);
    exp_data.push([]);
    theo_data.push([]);
    lambda_vals.push(ar);
    mu_vals.push(sr);


    // console.log(ar);
    // console.log(sr);
    console.log({'ar':ar, 'sr':sr}, ar<sr, 'rho >= 1')
    document.getElementById("params").innerHTML = "Mean Arrival Rate: " + ar + ", Mean Service Rate: " + sr;
    if (ar >= sr) {
        console.log('Condition Wrong')
        document.getElementById("th_cs").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_cs").innerHTML =
            ex_cs >= 0 && ex_cs != NaN
                ? ex_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_cq").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_cq").innerHTML =
            ex_cq >= 0 && ex_cq != NaN
                ? ex_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_ts").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_ts").innerHTML =
            ex_ts >= 0 && ex_ts != NaN
                ? ex_ts.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("th_qt").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_qt").innerHTML =
            ex_qt >= 0 && ex_qt != NaN
                ? ex_qt.toFixed(2)
                : "Unable to calculate results";
        
        document.getElementById("ex").innerHTML =
            "Time-dependent Results (Simulation time: " +
            (time.toFixed(2) >= 0
                ? time.toFixed(2)
                : "Time for simulation cannot be generated for given inputs") +
            ")";

        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
    } else {
        document.getElementById("th_cs").innerHTML =
            th_cs >= 0 && th_cs != NaN
                ? th_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("ex_cs").innerHTML =
            ex_cs >= 0 && ex_cs != NaN
                ? ex_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_cq").innerHTML =
            th_cq >= 0 && th_cq != NaN
                ? th_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("ex_cq").innerHTML =
            ex_cq >= 0 && ex_cq != NaN
                ? ex_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_ts").innerHTML =
            th_ts >= 0 && th_ts != NaN
                ? th_ts.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("ex_ts").innerHTML =
            ex_ts >= 0 && ex_ts != NaN
                ? ex_ts.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("th_qt").innerHTML =
            th_qt >= 0 && th_qt != NaN
                ? th_qt.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("ex_qt").innerHTML =
            ex_qt >= 0 && ex_qt != NaN
                ? ex_qt.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("ex").innerHTML =
            "Time-dependent Results (Simulation time: " +
            (time.toFixed(2) >= 0
                ? time.toFixed(2)
                : "Time for simulation cannot be generated for given inputs") +
            ")";
        theo_data[theo_data.length-1].push((th_cs >= 0 && th_cs != NaN) ? ("" + th_cs.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_cq >= 0 && th_cq != NaN) ? ("" + th_cq.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_ts >= 0 && th_ts != NaN) ? ("" + th_ts.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_qt >= 0 && th_qt != NaN) ? ("" + th_qt.toFixed(2)) : "Unable to calculate results");
    }
    exp_data[exp_data.length-1].push((ex_cs >= 0 && ex_cs != NaN) ? ("" + ex_cs.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_cq >= 0 && ex_cq != NaN) ? ("" + ex_cq.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_ts >= 0 && ex_ts != NaN) ? ("" + ex_ts.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_qt >= 0 && ex_qt != NaN) ? ("" + ex_qt.toFixed(2)) : "Unable to calculate results");
}

function drawTable1() {
    document.getElementById("table_div").style.width = "40vw";
    document.getElementById("chart_div").style.width = "40vw";
    chart.draw(data, options);
    document.getElementById("table_div").style.display = "block";

    // console.log(ar);
    // console.log(sr);
    let th_cs = rho + (rho*rho*0.5)/(1-rho);
    // console.log(th_cs);
    console.log('rho:', rho)
    let ex_cs = av_cust_s / time;
    let th_cq = th_cs - rho;
    let ex_cq = av_cust_q / time;
    let th_ts = th_cs / ar;
    let ex_ts = av_time_s / cust_total;
    let th_st = 1 / sr;
    let ex_st = av_st / (cust_total - cust + 1);
    // Time in queue
    let ex_qt;
    if(num_wait==0) {
        ex_qt = 0.0;
    }
    else{
      ex_qt = ex_ts-av_st/cust_total;
    }
    let th_qt = th_cq / ar;
    let chart_data_coll = []
    let exp_times = []
    let exp_data = []
    let theo_data = []
    let lambda_vals = []
    let mu_vals = []

    chart_data_coll.push(data);
    console.log('console_data_coll.length=', chart_data_coll.length);
    exp_times.push(time);
    exp_data.push([]);
    theo_data.push([]);
    lambda_vals.push(ar);
    mu_vals.push(sr);


    // console.log(ar);
    // console.log(sr);
    console.log({'ar':ar, 'sr':sr}, ar<sr, 'rho >= 1')
    document.getElementById("params").innerHTML = "Mean Arrival Rate: " + ar + ", Mean Service Rate: " + sr;
    if (ar >= sr) {
        console.log('Condition Wrong')
        document.getElementById("th_cs").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_cs").innerHTML =
            ex_cs >= 0 && ex_cs != NaN
                ? ex_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_cq").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_cq").innerHTML =
            ex_cq >= 0 && ex_cq != NaN
                ? ex_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_ts").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_ts").innerHTML =
            ex_ts >= 0 && ex_ts != NaN
                ? ex_ts.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("th_qt").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_qt").innerHTML =
            ex_qt >= 0 && ex_qt != NaN
                ? ex_qt.toFixed(2)
                : "Unable to calculate results";
        
        document.getElementById("ex").innerHTML =
            "Time-dependent Results (Simulation time: " +
            (time.toFixed(2) >= 0
                ? time.toFixed(2)
                : "Time for simulation cannot be generated for given inputs") +
            ")";

        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
    } else {
        document.getElementById("th_cs").innerHTML =
            th_cs >= 0 && th_cs != NaN
                ? "-"
                : "-";
        document.getElementById("ex_cs").innerHTML =
            ex_cs >= 0 && ex_cs != NaN
                ? ex_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_cq").innerHTML =
            th_cq >= 0 && th_cq != NaN
                ? "-"
                : "-";
        document.getElementById("ex_cq").innerHTML =
            ex_cq >= 0 && ex_cq != NaN
                ? ex_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_ts").innerHTML =
            th_ts >= 0 && th_ts != NaN
                ? "-"
                : "-";
        document.getElementById("ex_ts").innerHTML =
            ex_ts >= 0 && ex_ts != NaN
                ? ex_ts.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("th_qt").innerHTML =
            th_qt >= 0 && th_qt != NaN
                ? "-"
                : "-";
        document.getElementById("ex_qt").innerHTML =
            ex_qt >= 0 && ex_qt != NaN
                ? ex_qt.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("ex").innerHTML =
            "Time-dependent Results (Simulation time: " +
            (time.toFixed(2) >= 0
                ? time.toFixed(2)
                : "Time for simulation cannot be generated for given inputs") +
            ")";
        theo_data[theo_data.length-1].push((th_cs >= 0 && th_cs != NaN) ? ("" + th_cs.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_cq >= 0 && th_cq != NaN) ? ("" + th_cq.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_ts >= 0 && th_ts != NaN) ? ("" + th_ts.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_qt >= 0 && th_qt != NaN) ? ("" + th_qt.toFixed(2)) : "Unable to calculate results");
    }
    exp_data[exp_data.length-1].push((ex_cs >= 0 && ex_cs != NaN) ? ("" + ex_cs.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_cq >= 0 && ex_cq != NaN) ? ("" + ex_cq.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_ts >= 0 && ex_ts != NaN) ? ("" + ex_ts.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_qt >= 0 && ex_qt != NaN) ? ("" + ex_qt.toFixed(2)) : "Unable to calculate results");
}

function drawTable2() {
    document.getElementById("table_div").style.width = "40vw";
    document.getElementById("chart_div").style.width = "40vw";
    chart.draw(data, options);
    document.getElementById("table_div").style.display = "block";

    // console.log(ar);
    // console.log(sr);
    let th_cs = rho + (ar*ar*variance+rho*rho)/(2*(1-rho));
    // console.log(th_cs);
    console.log('rho:', rho)
    let ex_cs = av_cust_s / time;
    let th_cq = th_cs - rho;
    let ex_cq = av_cust_q / time;
    let th_ts = th_cs / ar;
    let ex_ts = av_time_s / cust_total;
    let th_st = 1 / sr;
    let ex_st = av_st / (cust_total - cust + 1);
    // Time in queue
    let ex_qt;
    if(num_wait==0) {
        ex_qt = 0.0;
    }
    else{
      ex_qt = ex_ts-av_st/cust_total;
    }
    let th_qt = th_cq / ar;
    let chart_data_coll = []
    let exp_times = []
    let exp_data = []
    let theo_data = []
    let lambda_vals = []
    let mu_vals = []

    chart_data_coll.push(data);
    console.log('console_data_coll.length=', chart_data_coll.length);
    exp_times.push(time);
    exp_data.push([]);
    theo_data.push([]);
    lambda_vals.push(ar);
    mu_vals.push(sr);


    // console.log(ar);
    // console.log(sr);
    console.log({'ar':ar, 'sr':sr}, ar<sr, 'rho >= 1')
    document.getElementById("params").innerHTML = "Mean Arrival Rate: " + ar + ", Mean Service Rate: " + sr;
    if (ar >= sr) {
        console.log('Condition Wrong')
        document.getElementById("th_cs").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_cs").innerHTML =
            ex_cs >= 0 && ex_cs != NaN
                ? ex_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_cq").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_cq").innerHTML =
            ex_cq >= 0 && ex_cq != NaN
                ? ex_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_ts").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_ts").innerHTML =
            ex_ts >= 0 && ex_ts != NaN
                ? ex_ts.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("th_qt").innerHTML =
            "Steady state solution does not exist";
        document.getElementById("ex_qt").innerHTML =
            ex_qt >= 0 && ex_qt != NaN
                ? ex_qt.toFixed(2)
                : "Unable to calculate results";
        
        document.getElementById("ex").innerHTML =
            "Time-dependent Results (Simulation time: " +
            (time.toFixed(2) >= 0
                ? time.toFixed(2)
                : "Time for simulation cannot be generated for given inputs") +
            ")";

        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
        theo_data[theo_data.length-1].push("Steady state solution does not exist");
    } else {
        document.getElementById("th_cs").innerHTML =
            th_cs >= 0 && th_cs != NaN
                ? "-"
                : "-";
        document.getElementById("ex_cs").innerHTML =
            ex_cs >= 0 && ex_cs != NaN
                ? ex_cs.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_cq").innerHTML =
            th_cq >= 0 && th_cq != NaN
                ? "-"
                : "-";
        document.getElementById("ex_cq").innerHTML =
            ex_cq >= 0 && ex_cq != NaN
                ? ex_cq.toFixed(2)
                : "Unable to calculate results";
        document.getElementById("th_ts").innerHTML =
            th_ts >= 0 && th_ts != NaN
                ? "-"
                : "-";
        document.getElementById("ex_ts").innerHTML =
            ex_ts >= 0 && ex_ts != NaN
                ? ex_ts.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("th_qt").innerHTML =
            th_qt >= 0 && th_qt != NaN
                ? "-"
                : "-";
        document.getElementById("ex_qt").innerHTML =
            ex_qt >= 0 && ex_qt != NaN
                ? ex_qt.toFixed(2)
                : "Unable to calculate results";

        document.getElementById("ex").innerHTML =
            "Time-dependent Results (Simulation time: " +
            (time.toFixed(2) >= 0
                ? time.toFixed(2)
                : "Time for simulation cannot be generated for given inputs") +
            ")";
        theo_data[theo_data.length-1].push((th_cs >= 0 && th_cs != NaN) ? ("" + th_cs.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_cq >= 0 && th_cq != NaN) ? ("" + th_cq.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_ts >= 0 && th_ts != NaN) ? ("" + th_ts.toFixed(2)) : "Unable to calculate results");
        theo_data[theo_data.length-1].push((th_qt >= 0 && th_qt != NaN) ? ("" + th_qt.toFixed(2)) : "Unable to calculate results");
    }
    exp_data[exp_data.length-1].push((ex_cs >= 0 && ex_cs != NaN) ? ("" + ex_cs.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_cq >= 0 && ex_cq != NaN) ? ("" + ex_cq.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_ts >= 0 && ex_ts != NaN) ? ("" + ex_ts.toFixed(2)) : "Unable to calculate results");
    exp_data[exp_data.length-1].push((ex_qt >= 0 && ex_qt != NaN) ? ("" + ex_qt.toFixed(2)) : "Unable to calculate results");
}

function stopSimulation() {
  clearInterval(chartId);
  if (currentSimulationType === "simulation1") {
    drawTable1();
  } else if (currentSimulationType === "simulation2") {
    drawTable2();
  }
  else{
    drawTable();
  }
}

function clearChart() {
  document.getElementById("table_div").style.display = "none";
  document.getElementById("chart_div").style.width = "100vw";
  if (chartId) clearInterval(chartId);
  data = google.visualization.arrayToDataTable([
    ["Time", "Customers"],
    [0, 0],
  ]);
  chart.draw(data, options);
  cust = 0;
  time = 0;
  av_cust_q = 0;
  av_cust_s = 0;
  av_time_s = 0;
  cust_total = 0;
  av_st = 0;
  num_wait=0;
}

function startSimulationBasedOnDistribution() {
  var serviceDistribution = document.getElementById('ad').value;

  var arrivalRate = document.getElementById('par1').value;
  var serviceParameter = document.getElementById('sr').value;
  var speed = 2000;

  if (serviceDistribution === 'Deterministic') {
      startSimulation1(arrivalRate, serviceParameter, speed);
  }
  else if (serviceDistribution === 'Uniform') {
    var param2 = document.getElementById('par2').value;
    startSimulation2(arrivalRate, param2, serviceParameter, speed);
  }
  else{
    startSimulation(arrivalRate, serviceParameter, speed);
  }
}
