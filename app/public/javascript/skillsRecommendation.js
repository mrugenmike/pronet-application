/**
 * Created by varuna on 4/29/15.
 */

$(document).ready(

    function () {
        console.log(data1);

        var datavalue="";
        var i;
        for (i = 0; i < data1.length-1; i++) {
            //datavalue = datavalue + "['"+  data1[i].skillName +"'," + data1[i].value + "],";
            datavalue = datavalue + "['"+  data1[i].skillName +"'," +20+ "],";
        }
        datavalue = datavalue + "['"+  data1[i].skillName +"'," + 20 + "]";
        console.log(datavalue);
        alert(datavalue);
        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: true
            },
            title: {
                text: 'Recommended<br>skills',
                color:'grey',
                align: 'center',
                verticalAlign: 'middle',
                y: 50
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',

                            textShadow: '0px 1px 2px black'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Recommended Skills',
                innerSize: '50%',
                data: [datavalue,
                    {
                        name: 'Others',
                        y: 0.7,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        });

    });