window.addEventListener('load', function() {
    // 检查是否登录
    function checkSign() {
        if (!sessionStorage.getItem('token')) {
            location.href = 'login.html';
        }
    };
    checkSign();
    // 班级信息查询导航 的事件
    function gradeInqure() {
        let ul = document.querySelector('.grade ul');
        ul.addEventListener('click', function(e) {
            for(let i=0; i<this.children.length; ++i) {
                this.children[i].className = '';
            } 
            if(e.target.tagName.toLowerCase() == 'li'){
                e.target.className = 'gradeActive';
            } else if (e.target.tagName.toLowerCase() == 'a') {
                e.target.parentNode.className = 'gradeActive';
            }
            initClassInfo();
            initClassName();
        })
    }
    gradeInqure();
    // 修改班级信息
    function gradeChange() {
        let spans = document.querySelectorAll('.gradeInfo li span');
        let btn = document.querySelector('[data-toggle="modal"]');
        let inputs = document.querySelectorAll('#exampleModal .form-group div');
        btn.addEventListener('click', function() {
            initClassName();
            spans.forEach(function(val, index) {
                if (index && index != spans.length-1) {
                    inputs[index].children[0].value = val.innerHTML;
                }     
            })
        })
    }
    gradeChange() 
    // ajax 班级导航 刷新 
    let token = sessionStorage.getItem('token');
    function initClass () {
        let classs = JSON.parse(sessionStorage.getItem('class'));
        let ul = document.querySelector('.grade ul');
        let input = document.querySelector('#exampleModal .form-group div');
        ul.innerHTML = '';
        classs.forEach(function(val, index) {
            if (index == 0) {
                input.children[0].value = val.className;
                ul.insertAdjacentHTML('beforeend', '<li class="gradeActive"><a>'+ val.className +'</a></li>');
            } else {
                ul.insertAdjacentHTML('beforeend', '<li><a>'+ val.className +'</a></li>');
            }
        })
    }
    initClass();
    // ajax 模态框班级名称更新 
    function initClassName() {
        let lis = document.querySelectorAll('.grade ul li');
        let input = document.querySelector('#exampleModal .form-group input');
        for (let i=0; i<lis.length; ++i) {
            if (lis[i].className == 'gradeActive') {
                input.value = lis[i].children[0].innerHTML;
                break;
            }
        }
    }
    initClassName();
    // ajax 班级及课程和学生信息 刷新
    function initClassInfo() {
        let lis = document.querySelectorAll('.grade ul li');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        for (let i=0; i<lis.length; ++i) {
            if (lis[i].className == 'gradeActive') {
                let setData1 = 'classId=' + classs[i].classId;
                let set1 = document.querySelectorAll('.gradeInfo ul li');
                let tbody = document.querySelector('.stuInfo tbody');
                ajax('get', 'getClassById', setData1, function(getData) {
                    set1[0].children[1].innerHTML = getData.data.classStudentName;
                }, token)
                ajax('get', 'getCourseByClassId', setData1, function(getData) {
                    set1[1].children[1].innerHTML = getData.data[0].courseName;
                    set1[2].children[1].innerHTML = getData.data[0].courseIntroduction;
                    set1[3].children[1].innerHTML = getData.data[0].courseHours;
                    set1[4].children[1].innerHTML = getData.data[0].courseFinishHours;
                }, token); 
                ajax('get', 'getStudentByClassId', setData1, function(getData) {
                    tbody.innerHTML = '';
                    getData.data.forEach(function(val) {
                         tbody.insertAdjacentHTML('beforeend', '<tr><td>'+val.studentId+'</td><td>'+val.studentName+'</td></tr>')
                    });
                }, token)
                break;
            }
        }
    }
    initClassInfo(); //另一部分转到了点击事件
    // ajax 修改班级信息 
    function reviseInfo() {
        let btn1 = document.querySelector('.modal-footer .btn-default');
        let divs = document.querySelectorAll('.modal-body .form-group div'); 
        let lis = document.querySelectorAll('.grade ul li');
        let classs = JSON.parse(sessionStorage.getItem('class'));
        let classNum = document.querySelector('.gradeInfo li span').innerHTML;
        let state = 1; //1 代表可以提交
        for (let i=0; i<divs.length; ++i) {
            if (!divs[i].children[0].value) {
                state = 0;
                alert('修改的信息不能为空!');
            }
        };
        if (state) {
            for (let i=0; i<lis.length; ++i) {
                if (lis[i].className == 'gradeActive') {
                    let setData1 = new Object();
                    let setData = '?classId=' + classs[i].classId;
                    setData1.className = divs[0].children[0].value;
                    setData1.classStudentNum = parseInt(classNum);
                    classs[i].className = divs[0].children[0].value;
                    ajax('post', 'updateClass' + setData, setData1, undefined, token)
                    let setData2 = new Object();
                    // 班级id 和 课程id 一样
                    let setData3 = '?courseId=' + classs[i].classId;
                    setData2.courseName = divs[1].children[0].value;
                    setData2.courseIntroduction = divs[2].children[0].value;
                    setData2.courseHours = divs[3].children[0].value;
                    // setData2.courseFinishHours = divs[4].children[0].value;
                    sessionStorage.setItem('class', JSON.stringify(classs));
                    initClass();
                    ajax('post', 'updateCourseById' + setData3, setData2, function(a) {
                        initClassInfo();
                    }, token);
                    alert("信息修改成功! ");
                    btn1.click();
                    break;
                }
            }
        }
    }
    function clcickReviseInfo() {
        let btn2 = document.querySelector('.modal-footer .btn-primary');
        btn2.addEventListener('click', reviseInfo);
    }
    clcickReviseInfo();
    // ajax  删除班级
    function deleteClass() {
        let btn = document.querySelector('#delete');
        btn.addEventListener('click', function() {
            let classs = JSON.parse(sessionStorage.getItem('class'));
            let lis = document.querySelectorAll('.grade li');
            for (let i=0; i<lis.length; ++i) {
                if (lis[i].className == 'gradeActive') {
                    let setData = '?classId=' + classs[i].classId + '&courseId=' + classs[i].classId;
                    classs.splice(i,1); 
                    sessionStorage.setItem('class', JSON.stringify(classs));
                    initClass(); 
                    ajax('delete', 'deleteById'+setData, undefined, function(a) {
                        console.log(a);
                        if (a.message != '删除失败！') {
                            initClassInfo();
                        }      
                    }, token);
                    break;   
                }
            }
        })
    }
    deleteClass();
})
