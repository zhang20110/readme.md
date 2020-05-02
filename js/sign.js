window.addEventListener('load', function () {
    // 检查是否登录
    function checkSign() {
        if (!sessionStorage.getItem('token')) {
            location.href = 'login.html';
        }
    };
    checkSign();
    // 点击 三角 caret
    function clickCaret() {
        let stu = document.querySelector('.signIn .stu');
        if (stu.previousElementSibling.className == 'caret carRotate') {
            stu.previousElementSibling.className = 'caret';
            stu.previousElementSibling.style.transform = 'scale(2)';
            stu.style.display = 'block';
        } else {
            stu.previousElementSibling.style.transform = '';
            stu.previousElementSibling.className = 'caret carRotate';
            stu.style.display = 'none';
        }
    }
    function Caret() {
        let carRotate = document.querySelector('.signIn .carRotate');
        carRotate.addEventListener('click', clickCaret);
    }
    Caret();
    // 班级信息查询导航 的点击事件
    function gradeInqure() {
        let ul = document.querySelector('.grade ul');
        let signIn = document.querySelector('.signIn');
        let stuTable = document.querySelector('.stuTable'); 
        ul.addEventListener('click', function (e) {
            for (let i = 0; i < this.children.length; ++i) {
                this.children[i].className = '';
            }
            if (e.target.tagName.toLowerCase() == 'li') {
                e.target.className = 'gradeActive';
            } else if (e.target.tagName.toLowerCase() == 'a') {
                e.target.parentNode.className = 'gradeActive';
            }
            clickFreshChart();
            // 点击导航栏后 显示学生签到信息的模块消失
            signIn.style.display = 'none';
            stuTable.style.display = 'none';

        })
    }
    gradeInqure();
    // 统计柱状图的js
    function absenceChart(i) {
        let datas = {
            type: 'bar',
            data: {
                labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
                datasets: [{
                    label: '最近一周的签到率统计',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(215, 130, 10, 0.2)'
                    ],
                    data: [0, 0, 0, 0, 0, 0, 0],
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }]
                }
            }
        };
        let token = sessionStorage.getItem('token');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        // let time = new Date().getTime();
        let date1 = new Date();
        let day = date1.getDay();
        let date2 = date1.getTime();
        if (!day) {
            var time1 = date2 - 6 * 60 * 60 * 24 * 1000;
            var time2 = getTime(time1);
        } else {
            var time1 = date2 - (day - 1) * 60 * 60 * 24 * 1000;
            var time2 = getTime(time1);
        };
        for (let j = 0; j < 7; ++j) {
            time2 = getTime(time1 + j * 60 * 60 * 24 * 1000);
            let setData = 'courseId=' + classs[i].classId + '&classId=' +
                classs[i].classId + '&date=' + time2;
            ajax('get', 'getAbsenceByDateAndCourseId', setData, function (a) {
                let setData1 = 'classId=' + classs[i].classId;
                let num;
                ajax('get', 'getClassById', setData1, function (b) {
                    num = b.data.classStudentName;
                    if (a.data) {
                        var num1 = a.data.length;
                    } else {
                        num1 = 0;
                    }
                    datas.data.datasets[0].data[j] = (((num - num1) / num).toFixed(2)) * 100;
                }, token);
            }, token);
        }
        let time = setInterval(function() {
            let ctx = document.querySelector('#myChart').getContext('2d');
            let myBarChart = new Chart(ctx, datas);
            clearInterval(time);
        }, 500)
    };
    absenceChart(0);
    // ajax 班级导航 刷新 
    let token = sessionStorage.getItem('token');
    function initClass() {
        let classs = JSON.parse(sessionStorage.getItem('class'));
        let ul = document.querySelector('.grade ul');
        // let input = document.querySelector('#exampleModal .form-group div');
        ul.innerHTML = '';
        classs.forEach(function (val, index) {
            if (index == 0) {
                // input.children[0].value = val.className;
                ul.insertAdjacentHTML('beforeend', '<li class="gradeActive"><a>' + val.className + '</a></li>');
            } else {
                ul.insertAdjacentHTML('beforeend', '<li><a>' + val.className + '</a></li>');
            }
        })
    }
    initClass();
    // ajax 显示班级总人数
    function showClassNum(i) {
        let ClassNum = document.querySelector('.signInAlert:nth-of-type(1) span');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        let setData = 'classId=' + classs[i].classId;
        ajax('get', 'getClassById', setData, function (getData) {
            ClassNum.innerHTML = getData.data.classStudentName;
        }, token);
    }
    showClassNum(0);
    // ajax 今日未签到学生信息 刷新
    function writeAbsence(i, day) {
        let tbody = document.querySelector('.signIn .stu tbody');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        let setData = 'courseId=' + classs[i].classId +
            '&date=' + day + '&classId=' + classs[i].classId;
        tbody.innerHTML = '';
        ajax('get', 'getAbsenceByDateAndCourseId', setData,
            function (getData) {
                let td1, td2;
                let classNum = document.querySelector('.signInAlert:nth-of-type(1) span').innerHTML;
                let absencePercentage = document.querySelector('.signInAlert:nth-of-type(3) span');
                let absenceNum = document.querySelector('.signIn .signInAlert:nth-of-type(2) span');
                if (getData.data) {
                    absenceNum.innerHTML = getData.data.length;
                    absencePercentage.innerHTML = (((classNum - getData.data.length) / classNum).toFixed(2)) * 100 + '%';//********** */
                    getData.data.forEach(function (val) {
                        td1 = val.studentId;
                        td2 = val.studentName;
                        tbody.insertAdjacentHTML('beforeend', '<tr><td>' +
                            td1 + '</td><td>' + td2 + '</td></tr>');
                    })
                } else {
                    absenceNum.innerHTML = day + '日 没有未签到学生';
                    absencePercentage.innerHTML = day+'日 没有未签到学生';
                }
            }, token)
    }
    //writeAbsence();  //转到了查询日期处
    // Ajax 点击班级后 图表的更新
    function clickFreshChart() {
        let lis = document.querySelectorAll('.grade ul li');
        let time = setInterval(function() {
            if (lis) {
                for (let i=0; i<lis.length; ++i) {
                    if (lis[i].className == 'gradeActive') {
                        absenceChart(i);      
                        break;
                    }
                }
                clearInterval(time);
            }
        },40);
    }
    // ajax 显示某班学生的全部未签到日期
    function stuDate(i, id, date) {
        let stuTable = document.querySelector('.stuTable tbody');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        let setData = 'courseId=' + classs[i].classId + '&studentId=' + id + '&classId=' + classs[i].classId;
        let setData1 = 'studentId=' + id + '&classId=' + classs[i].classId;
        stuTable.innerHTML = '';
        if (date) {
            setData += '&date=' + date;
            ajax('get', 'getStudentById', setData1, function(b) {
                if (b.message != 'success!') {
                    stuTable.insertAdjacentHTML('beforeend', '<tr><td style="color:red">学号错误,未找到该学生</td></tr>');
                } else {
                    ajax('get', 'getAbsence', setData, function(a) {
                        if (a.data) {
                            stuTable.insertAdjacentHTML('beforeend', '<tr><td>'+id+'</td><td>'+b.data.studentName+'</td><td>'+a.data.createTime+'</td></tr>');
                        }  else {
                            stuTable.insertAdjacentHTML('beforeend', '<tr><td style="color:red">该学生 '+date+'日 没有未签到记录</td></tr>');
                        } 
                    }, token);
                }
            }, token)
        } else {
            ajax('get', 'getStudentById', setData1, function(a) {
                if (a.message != 'success!') {
                    stuTable.insertAdjacentHTML('beforeend', '<tr><td style="color:red">学号错误,未找到该学生</td></tr>');
                } else {
                    ajax('get', 'getAbsenceByCourseIdAndStudentId', setData, function(a) {
                    if (a.data) {
                        a.data.forEach(function(val) {
                            stuTable.insertAdjacentHTML('beforeend', '<tr><td>'+id+'</td><td>'+val.studentName+'</td><td>'+val.createTime+'</td></tr>');
                        })
                    } else {
                        stuTable.insertAdjacentHTML('beforeend', '<tr><td style="color:red">该学生没有未签到记录</td></tr>');
                    }
                        console.log(a);
                
                    }, token);
                }
            }, token) 
        }
    }
    // ajax 日期查询
    function dateCheck() {
        let inputs = document.querySelectorAll('.search input');
        let btn = document.querySelector('.search button');
        let signIn = document.querySelector('.signIn');
        let stuTable = document.querySelector('.stuTable');
        btn.addEventListener('click', function() {
            let lis = document.querySelectorAll('.grade ul li');
            for (var i=0; i<lis.length; ++i) {
                if (lis[i].className == 'gradeActive') {
                    break;
                }
            }
            if (inputs[0].value && !(inputs[1].value)) {
                writeAbsence(i, inputs[0].value);
                signIn.style.display = 'block';
                stuTable.style.display = 'none';
            } else if (!(inputs[0].value) && inputs[1].value) {
                stuDate(i, inputs[1].value);
                signIn.style.display = 'none';
                stuTable.style.display = 'block';
            } else if (inputs[0].value && inputs[1].value){
                stuDate(i, inputs[1].value, inputs[0].value);
                signIn.style.display = 'none';
                stuTable.style.display = 'block';
            }
        })   
    }
    dateCheck();
})