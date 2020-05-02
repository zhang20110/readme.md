window.addEventListener('load', function () {
    //ajax 页面刷新的初始化 
    function homeInit() {
        let token = sessionStorage.getItem('token');
        if (!token) {
            location.href = 'login.html';
        }
    }
    homeInit();
    // ajax 有户名的刷新 
    function userNameFresh() {
        let userName = document.querySelector('#userName');
        userName.innerHTML = sessionStorage.getItem('userName');
    }
    userNameFresh();
    //* 竖直导航的js
    let ul = document.querySelector('.verticalBar ul');
    ul.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'li') {
            if (e.target != this.lastElementChild) {
                for (let i = 0; i < ul.children.length - 1; ++i) {
                    ul.children[i].className = 'blurLi';
                }
                e.target.className = 'activeLi';
            }
        }
    });

    //* 竖直导航的js


    // 课表的js
    var tbodyTd = document.querySelectorAll('.timetable tbody td');
    let reg = /^\s*$/;
    let menu = document.querySelector('.rightMenu ul');
    let token = sessionStorage.getItem('token');
    tbodyTd.forEach(function (value) {
        // 修改或添加 课程
        if (value.className != 'timeActive') {
            value.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                let x = e.clientX + 'px';
                let y = e.clientY + 'px';
                let dataX = this.getAttribute('data-x');
                menu.style.top = y;
                menu.style.left = x;
                menu.style.display = 'block';
                menu.setAttribute('target', dataX);
            })
        }
    })
    //* 柱状图的js
    //配置数据  
    // let datas = {
    //     type: 'bar',
    //     data: {
    //         labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
    //         datasets: [{
    //             label: '课堂情况打分',
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)',
    //                 'rgba(215, 130, 10, 0.2)'
    //             ],
    //             data: [40, 10, 5, 2, 20, 30, 55],
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     min: 0,
    //                     max: 100
    //                 }
    //             }]
    //         }
    //     }
    // };
    // let ctx = document.querySelector('#myChart').getContext('2d');
    // let myBarChart = new Chart(ctx, datas);
    //* 柱状图的js
    // 扇形图的js
    function showChart() {
        var datas = {
            type: 'pie',
            data: {
                datasets: [{
                    data: [10, 100],
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235, 0.2)',
                    ],
                    borderWidth: 0,
                }],
                labels: [
                    '已完成课时',
                    '剩余课时',
                ]
            },
            //   options: options
        }
        let courseHour = document.querySelector('#finishCourse');
        let time = document.querySelector('#courseTime');
        let trs = document.querySelectorAll('.timetable tbody tr');
        let date = new Date();
        let day = date.getDay();
        let str = ' ';
        let token = sessionStorage.getItem('token');
        let setData = 'courseId=' + sessionStorage.getItem('courseId');
        ajax('get', 'getCourseById', setData, function (a) {
            datas.data.datasets[0].data[0] = a.data.courseFinishHours;
            datas.data.datasets[0].data[1] = a.data.courseHours - a.data.courseFinishHours;
            if (datas.data.datasets[0].data[1] == 0) {
                datas.data.datasets[0].data.splice(1, 1);
            }
            courseHour.innerHTML = a.data.courseFinishHours;
            for (let i = 0; i < trs.length; ++i) {
                if (!day) {
                    if (trs[i].children[7].innerHTML) {
                        str += trs[i].children[0].innerHTML + ' ';
                    }
                } else {
                    if (trs[i].children[day].innerHTML) {
                        str += trs[i].children[0].innerHTML + ' ';
                    }
                }
            }
            if (str == ' ') {
                time.innerHTML = '今天无课';
            } else {
                time.innerHTML = '今天的<span style="color: red;font-weight:600;font-size: 18px;">' + str + '</span>有课';
            }
            let ctx = document.querySelector('#myChart').getContext('2d');
            let myPieChart = new Chart(ctx, datas);
        }, token);
    }
    // showChart();  转到了课表的刷新处 和 课表事件 

    //* 选择未签到学生的 将其添加到‘今日的未签到人数’框下 js
    function chooseS() {
        let tbody = document.querySelector('.signIn .chooseStu tbody');
        let btn = document.querySelector('.signIn>button');
        btn.addEventListener('click', function () {
            let chooseStu = this.nextElementSibling;
            if (this.innerHTML == '确认') {
                this.innerHTML = '录入未签到学生'
                chooseStu.style.display = 'none';
                // chooseStu();
                // let checks = tbody.querySelectorAll('input');
                // let stu = document.querySelector('.signIn .stu tbody');
                // stu.innerHTML = '';
                // checks.forEach(function (value) {
                //     if (value.checked) {
                //         value.checked = false;
                //         let td2 = value.parentNode.previousElementSibling.innerHTML;
                //         let td1 = value.parentNode.previousElementSibling.previousElementSibling.innerHTML;
                //         stu.insertAdjacentHTML('beforeend', '<tr><td>' + td1 + '</td><td>' + td2 + '</td></tr>');
                //     }
                // })
                recordAbsence();
                // writeAbsenceCheck();
                clickCaret();
            } else {
                // chooseStu();
                this.innerHTML = '确认';
                chooseStu.style.display = 'block';
            }
        });
        tbody.addEventListener('click', function (e) {
            if (e.target.tagName.toLowerCase() == 'td') {
                let checkbox = e.target.parentNode.children[2].children[0];
                if (checkbox.checked) {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                }
            }
        })
    }
    chooseS();
    //选择未签到学生的 将其添加到‘今日的未签到人数’框下 js

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
        // writeAbsence();
    }
    function Caret() {
        let carRotate = document.querySelector('.signIn .carRotate');
        carRotate.addEventListener('click', clickCaret);
    }
    Caret();
    // 弹出的模态框中 批量录入学生信息的js
    function addStu() {
        let tbody = document.querySelector('#students tbody');
        let btn = document.querySelector('#studentsBtn');
        tbody.addEventListener('click', function (e) {
            if (e.target.tagName.toLowerCase() === 'span') {
                let tr = e.target.parentNode.parentNode.parentNode.parentNode;
                let val = new Array();
                for (let i = 0; i < tr.children.length - 1; ++i) {
                    val[i] = tr.children[i].innerHTML;
                };
                if (e.target.className === 'glyphicon glyphicon-pencil') {
                    e.target.className = 'glyphicon glyphicon-ok';
                    e.target.parentNode.nextElementSibling.children[0].className = 'glyphicon glyphicon-remove';
                    let sibling = e.target.parentNode.nextElementSibling.children[0];
                    for (let i = 0; i < tr.children.length - 1; ++i) {
                        tr.children[i].innerHTML = '<input type="text">';
                        // tr.children[i].style.verticalAlign = 'middle';
                        tr.children[i].style.width = '26%';
                        tr.children[i].children[0].style.width = "100%";
                        tr.children[i].children[0].value = val[i];
                        tr.children[i].setAttribute('data-con', val[i]);
                    }

                } else if (e.target.className === 'glyphicon glyphicon-trash') {
                    tr.parentNode.removeChild(tr);
                } else if (e.target.className === 'glyphicon glyphicon-ok') {
                    // e.stopPropagation();
                    e.target.className = 'glyphicon glyphicon-pencil';
                    e.target.parentNode.nextElementSibling.children[0].className = 'glyphicon glyphicon-trash';
                    for (let i = 0; i < tr.children.length - 1; ++i) {
                        let val = tr.children[i].children[0].value;
                        tr.children[i].innerHTML = val;
                        // tr.children[i].style.verticalAlign = 'middle';
                        tr.children[i].style.width = '';
                        tr.children[i].setAttribute('data-con', '');
                    }
                } else if (e.target.className === 'glyphicon glyphicon-remove') {
                    // e.stopPropagation();
                    e.target.className = 'glyphicon glyphicon-trash';
                    e.target.parentNode.previousElementSibling.children[0].className = 'glyphicon glyphicon-pencil';
                    for (let i = 0; i < tr.children.length - 1; ++i) {
                        tr.children[i].innerHTML = tr.children[i].getAttribute('data-con');
                        // tr.children[i].style.verticalAlign = 'middle';
                        tr.children[i].style.width = '';
                        tr.children[i].setAttribute('data-con', '');
                    }
                }
            }
        })
        btn.addEventListener('click', function () {
            let tr = '<tr><td></td><td></td>' +
                '<td>' +
                '<div class="btn-group btn-group-xs" role="group" style="float: right;">' +
                ' <button type="button" class="btn btn-default">' +
                ' <span class="glyphicon glyphicon-pencil"></span>' +
                '</button>' +
                '<button type="button" class="btn btn-default">' +
                '<span class="glyphicon glyphicon-trash"></span>' +
                '</button>' +
                '</div>' +
                '</td>' +
                '</tr>';
            tbody.insertAdjacentHTML('beforeend', tr);
        });
    }
    addStu();
    // 点击添加班级 模态框初始化
    function initialize() {
        let addGroup = document.querySelector('[data-toggle="modal"]');
        let tbody = document.querySelector('#students tbody');
        let inputs = document.querySelectorAll('.form-group div');
        addGroup.addEventListener('click', function () {
            tbody.innerHTML = '';
            inputs.forEach(function (val) {
                val.children[0].value = '';
            })
        })
    }
    initialize();
    //ajax 竖直导航刷新
    function verticalBar() {
        let setData = 'userId=' + sessionStorage.getItem('userId');
        let token = sessionStorage.getItem('token');
        let ul = document.querySelector('.verticalBar ul');
        let add = document.querySelector('.verticalBar .addClass');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        // 获取对应课程的 classId
        sessionStorage.setItem('classId', classs[0].classId);
        sessionStorage.setItem('className', classs[0].className);
        classs.forEach(function (val, index) {
            if (index === 0) {
                // 获取对应课程的 courseId
                let setData = 'classId=' + classs[0].classId;
                ajax('get', 'getCourseByClassId', setData, function (getData) {
                    sessionStorage.setItem('courseId', getData.data[0].courseId);
                    sessionStorage.setItem('courseName', getData.data[0].courseName);
                    setTimetable();
                }, token)
            }
            let li = document.createElement('li');
            li.innerHTML = val.className;
            ul.insertBefore(li, add);
        })
    };
    verticalBar();

    // ajax 课表的刷新
    function setTimetable() {
        let tbody = document.querySelector('.timetable tbody');
        let courseId = sessionStorage.getItem('courseId');
        let setData = 'courseId=' + courseId;
        let token = sessionStorage.getItem('token');
        // 清除上一个班级的课表
        let trs = tbody.querySelectorAll('tr');
        trs.forEach(function (val) {
            let tds = val.querySelectorAll('td');
            tds.forEach(function (vall, index) {
                if (index) {
                    vall.innerHTML = '';
                    vall.className = '';
                }
            })
        });
        ajax('get', 'getCoordinate', setData, function (getData) {
            let td;
            if (getData.data) {
                getData.data.forEach(function (val) {
                    td = tbody.querySelector('[data-x="' + val.x + '"]');
                    td.innerHTML = sessionStorage.getItem('courseName');
                    td.className = 'timeHave';
                })
            }
            showChart();
        }, token)
    }
    // setTimetable();  转到了竖直导航的刷新处
    //ajax 课表的事件
    for (let i = 0; i < menu.children.length; ++i) {
        menu.children[i].addEventListener('click', function () {
            let setData = new Object();
            setData.courseId = sessionStorage.getItem('courseId');
            setData.x = this.parentNode.getAttribute('target');
            setData.y = 0;
            let li = document.querySelector('[data-x="' + setData.x + '"]');
            if (!li.innerHTML && this.innerHTML === '添加课程') {
                // ajax 添加课程
                ajax('post', 'addCoordinate', setData, undefined, token);
                li.innerHTML = sessionStorage.getItem('courseName');
                li.className = 'timeHave';
                showChart();
            } else if (li.innerHTML && this.innerHTML === '删除课程') {
                let setData1 = 'x=' + setData.x + '&y=' + 0 + '&courseId=' + sessionStorage.getItem('courseId');
                ajax('delete', 'deleteCoordinate?' + setData1, undefined, undefined, token);
                li.innerHTML = '';
                li.className = '';
                showChart();
            } else if (li.innerHTML && this.innerHTML === '完成课程') {
                let setData = sessionStorage.getItem('courseId') + '?increaseHours=2';
                ajax('post', 'updateHours/' + setData, undefined, function (a) {
                    console.log(a);
                    showChart();
                }, token);
            }
        })
    }
    window.addEventListener('click', function () {
        menu.style.display = 'none';
    })

    // 检测 是否有的学生今天已经录入 防止一天重复录入
    function writeAbsenceCheck() {
        let tbody = document.querySelector('.chooseStu tbody');
        let setData = 'courseId=' + sessionStorage.getItem('courseId') +
            '&date=' + getTime() + '&classId=' +
            sessionStorage.getItem('classId');
        // tbody.innerHTML = '';
        ajax('get', 'getAbsenceByDateAndCourseId', setData,
            function (getData1) {
                let td1;
                let trs = tbody.querySelectorAll('tr');
                // console.log(getData1);      
                if (getData1.data) {
                    // console.log(getData1.data);
                    getData1.data.forEach(function (val) {
                        td1 = val.studentId;
                        // console.log(td1);
                        trs.forEach(function (val) {
                            if (td1 == val.children[0].innerHTML) {
                                val.children[2].innerHTML = '<span class="text-danger">今日此学生已记录未签到</span>';
                            }
                        });
                    })
                }
            }, token)
    }
    //Ajax 选定未签到学生的区域的信息 刷新
    function chooseStu() {
        let setData = 'classId=' + sessionStorage.getItem('classId');
        ajax('get', 'getStudentByClassId', setData, function (getData) {
            let tbody = document.querySelector('.chooseStu tbody');
            let tr = '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td><input type="checkbox"></td>' +
                '</tr>';
            // console.log(getData); 
            tbody.innerHTML = '';
            getData.data.forEach(function (val) {
                tbody.insertAdjacentHTML('beforeend', tr);
                tbody.lastElementChild.children[0].innerHTML = val.studentId;
                tbody.lastElementChild.children[1].innerHTML = val.studentName;
            })
            writeAbsenceCheck();
            // console.log(getData)
        }, token)
    }
    chooseStu();
    // ajax 今日未签到学生信息 刷新
    function writeAbsence() {
        let tbody = document.querySelector('.signIn .stu tbody');
        let setData = 'courseId=' + sessionStorage.getItem('courseId') +
            '&date=' + getTime() + '&classId=' +
            sessionStorage.getItem('classId');
        tbody.innerHTML = '';
        ajax('get', 'getAbsenceByDateAndCourseId', setData,
            function (getData) {
                let td1, td2;
                let classNum = document.querySelector('.signInAlert:nth-of-type(2) span').innerHTML;
                let absencePercentage = document.querySelector('.signInAlert:nth-of-type(4) span');
                let absenceNum = document.querySelector('.signIn .signInAlert:nth-of-type(3) span');
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
                    absenceNum.innerHTML = '请录入今日的未签到学生';
                    absencePercentage.innerHTML = '请录入今日的未签到学生';
                }
            }, token)
    }
    writeAbsence(); // 另一半转入了点击导航栏
    // Ajax 向服务器写入未签到学生
    function recordAbsence() {
        let tr = document.querySelectorAll('.signIn .chooseStu tbody tr');
        let check;
        let stus = new Array();
        let setData = '?classId=' + sessionStorage.getItem('classId');
        tr.forEach(function (val) {
            check = val.lastElementChild.children[0];
            if (check.checked) {
                let stu = new Object();
                check.checked = false;
                stu.courseId = sessionStorage.getItem('courseId');
                stu.studentId = val.children[0].innerHTML;
                stu.createTime = getTime();
                stus.push(stu);
            }
        })
        ajax('post', 'addAbsences' + setData, stus, function () {
            writeAbsence();
            writeAbsenceCheck();
        }, token);
    }
    //recordAbsence();  转入点击事件

    // ajax 显示班级总人数
    function showClassNum() {
        let ClassNum = document.querySelector('.signInAlert:nth-of-type(2) span');
        let setData = 'classId=' + sessionStorage.getItem('classId');
        ajax('get', 'getClassById', setData, function (getData) {
            ClassNum.innerHTML = getData.data.classStudentName;
        }, token);
    }
    showClassNum();
    // ajax *******点击竖直导航栏********
    function clickVer() {
        ul.addEventListener('click', function (e) {
            let classs = JSON.parse(sessionStorage.getItem('class'));
            if (e.target.tagName.toLowerCase() == 'li') {
                if (e.target != this.lastElementChild) {
                    for (let i = 0; i < this.children.length; ++i) {
                        // console.log(this.children[i]);
                        if (this.children[i] == e.target) {
                            sessionStorage.setItem('classId', classs[i].classId);
                            sessionStorage.setItem('className', classs[i].className);
                            // 获取对应课程的 courseId
                            let setData = 'classId=' + classs[i].classId;
                            ajax('get', 'getCourseByClassId', setData, function (getData) {
                                sessionStorage.setItem('courseId', getData.data[0].courseId);
                                sessionStorage.setItem('courseName', getData.data[0].courseName);
                                showClassNum();
                                setTimetable();
                                initCourseName();
                                chooseStu();
                                writeAbsence();
                            }, token);
                            break;
                        }
                    }
                }
            }
        })
    }
    clickVer();
    // ajax 导航栏的课程信息 刷新 
    function initCourseName() {
        let a = document.querySelector('.navbar-header a');
        let courseName = sessionStorage.getItem('courseName');
        a.innerHTML = courseName;
    }
    initCourseName();
    //ajax 退出登录
    function exit() {
        let close = document.querySelector('.dropdown-menu li:nth-of-type(3)');
        close.addEventListener('click', function () {
            sessionStorage.clear();
            location.href = 'login.html';
        })
    }
    exit();

})

// ajax 点击模态框的添加班级
function addClass() {
    // 检测信息是否填写完整
    let reg = /^\s*$/;
    let reg1 = /^([1-9][0-9]*)$/; //检验是否时数字
    let state = 1;  //信息是否完整
    let token = sessionStorage.getItem('token');
    let inputs = document.querySelectorAll('.modal-body .form-group div');
    let td = document.querySelectorAll('#students tbody td');
    let tbody = document.querySelector('#students tbody');
    let span = document.querySelector('.file span');
    for (let i = 0; i < inputs.length; ++i) {
        if (reg.test(inputs[i].children[0].value)) {
            state = 0;
            alert("请输入" + inputs[i].previousElementSibling.innerHTML);
            inputs[i].children[0].select();
            return;
        }
    }
    if (reg1.test(inputs[1].children[0].value) === false) {
        alert("班级人数应是数字");
        return;
    } else if (reg1.test(inputs[4].children[0].value) === false) {
        alert("课程总学时应是数字");
        return;
    } else if (/^([0-9]*)$/.test(inputs[5].children[0].value) === false) {
        alert("课程已完成学时应是数字");
        return;
    };
    if (!span.innerHTML) {
        if (tbody.children[0] === undefined) {
            alert('请录入学生信息');
            return;
        } else if (tbody.children.length < inputs[1].children[0].value) {
            state = 0;
            alert("学生人数不完整，请输入完整的学生信息");
            return;
        } else if (tbody.children.length > inputs[1].children[0].value) {
            state = 0;
            alert("学生人数超数，请检查学生信息");
            return;
        }
        for (let i = 0; i < td.length; ++i) {
            if (i % td[i].parentNode.children.length != td[i].parentNode.children.length - 1) {
                if (td[i].innerHTML === '') {
                    state = 0;
                    alert("请输入完整的学生信息");
                    return;
                } else if (td[i].children[0]) {
                    state = 0;
                    alert("请在学生修改栏点击√");
                    return;
                } else if (i % td[i].parentNode.children.length === 0) {
                    if (reg1.test(td[i].innerHTML) === false) {
                        alert('学号请输入数字');
                        return;
                    }
                }
            }
        }
    }
    // 如果信息填写完整
    if (state) {
        // 添加班级
        let setData1 = new Object();
        setData1.className = inputs[0].children[0].value;
        setData1.classStudentNum = inputs[1].children[0].value;
        setData1.userId = sessionStorage.getItem('userId');
        ajax('post', 'addClass', setData1, function () {
            //将刚添加的班级id 写入sessionStroage
            let setData3 = 'userId=' + sessionStorage.getItem('userId');
            ajax('get', 'getClassesByUserId', setData3, function (getData) {
                let stus = JSON.parse(sessionStorage.getItem('class'));
                let stu = new Object();
                stu.classId = getData.data[getData.data.length - 1].classId;
                stu.className = getData.data[getData.data.length - 1].className;
                stus.push(stu);
                sessionStorage.setItem('class', JSON.stringify(stus));

                //获取 完 班级id 后 添加课程
                let setData2 = new Object();
                setData2.courseName = inputs[2].children[0].value;
                setData2.courseIntroduction = inputs[3].children[0].value;
                setData2.courseHours = inputs[4].children[0].value;
                setData2.courseFinishHours = inputs[5].children[0].value;
                let classs = JSON.parse(sessionStorage.getItem('class'));
                setData2.classId = classs[classs.length - 1].classId;
                ajax('post', 'addCourse', setData2, function () {
                    if (!span.innerHTML) {
                        // 添加学生
                        let setData4 = new Array();
                        let setData5 = new Object();
                        let num = td[0].parentNode.children.length;
                        for (let i = 0; i < td.length; ++i) {
                            if (i % num == 0) {
                                setData5.studentId = td[i].innerHTML;
                            } else if (i % num == 1) {
                                setData5.studentName = td[i].innerHTML;
                            } else if (i % num == 2) {
                                setData5.classId = classs[classs.length - 1].classId;
                                setData4.push(setData5);
                                setData5 = new Object();
                            }
                        };
                        ajax('post', 'addStudents', setData4, function (a) {
                            let li = document.createElement('li');
                            let add = document.querySelector('.verticalBar .addClass');
                            let shut = document.querySelector('[data-dismiss="modal"]');
                            li.innerHTML = setData1.className;
                            add.parentNode.insertBefore(li, add);
                            alert('班级建立成功');
                            shut.click();
                        }, token);
                    } else {
                        excelLoad(classs[classs.length - 1].classId);
                        alert('班级建立成功');
                        shut.click();
                    }
                }, token);
            }, token);
        }, token);
    }
}
// 新增的 excel表格的导入 显示文件名
function upload() {
    let span = document.querySelector('.file span');
    span.innerHTML = document.querySelector('#file').files[0].name;
}
//新增的 excel表格的导入
function excelLoad(classId) {
    let file = document.querySelector('#file').files[0];
    let formData = new FormData();
    let xhr = new XMLHttpRequest();
    let token = sessionStorage.getItem('token');
    formData.append('file', file);
    xhr.open('post', 'http://182.92.121.195:8080/progress/addStudentsByExcel?classId=' + classId);
    xhr.setRequestHeader('token', token);
    xhr.send(formData);
    xhr.onload = function () {
        console.log(JSON.parse(xhr.responseText));
    }
};