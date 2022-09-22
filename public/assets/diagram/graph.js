
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';
// Bar Chart Example 


const getDetails = async () => {
  try {
    const response = await axios.get("/admin/getGraphDetails")

    const userLabels = response.data.totalRegister.map(item => {
      return item.createdAt
    })

    const userData = response.data.totalRegister.map(item => {
      return item.count
    })

    const salesLabels = response.data.totalSale.map(item => {
      return item._id
    })

    const salesData = response.data.totalSale.map(item => {
      return item.sales.toFixed(2)
    })

    var barCtx = document.getElementById("myBarChart");
    var myBarChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: userLabels.reverse(),
        datasets: [{
          label: "Registration",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: userData.reverse(),
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'Date'
            },
            gridLines: {
              display: true
            },
            ticks: {
              // maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              // max: 1000,
              // maxTicksLimit: 7
            },
            gridLines: {
              display: true
            }
          }],
        },
        legend: {
          display: true
        }
      }
    });


    var lineCtx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: salesLabels.reverse(),
        datasets: [{
          label: "Sales",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: salesData.reverse(),
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              // max: 40000,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });


  } catch (err) {
    console.log(err)
  }
}

getDetails()

