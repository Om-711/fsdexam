async function go(){
    const name = document.getElementById("name").value
    const password = document.getElementById("password").value
    const roleSelect = document.getElementById("role")
    const selectedRoleText = roleSelect.options[roleSelect.selectedIndex].text
    const errorDiv = document.getElementById("error")

    if(!name || !password){
        errorDiv.innerText = "Please fill all fields"
        return
    }

    const response = await axios.post("http://localhost:3000/login",{
        name:name,
        password:password,
        role:selectedRoleText
    })

    if(response.data.message === 'Work'){
        sessionStorage.setItem('studentName', name)
        const normalizedRole = selectedRoleText.trim().toLowerCase()
        if(normalizedRole === "student"){
            window.location.href = "./Student.html"
        }
        else if(normalizedRole === "faculty"){
            window.location.href = "./faculty.html"
        }
    }
}


async function loadAssign(){
    const response = await axios.get("http://localhost:3000/assignment")
    const data  = response.data.data

    const table = document.getElementById('assigntable');
    table.innerHTML = ""

    for(let i=0;i<data.length;i++){

        const row = document.createElement("tr")

        const title = document.createElement("td")
        title.innerText = data[i].title

        const course = document.createElement("td")
        course.innerText = data[i].course

        const due = document.createElement("td")
        due.innerText = data[i].due_date

        const desc = document.createElement("td")
        desc.innerText = data[i].description

        row.append(title)
        row.append(course)
        row.append(due)
        row.append(desc)

        table.append(row)
    }
}

async function add(){

    const response = await axios.get("http://localhost:3000/assignment")
    const data = response.data.data

    const select = document.getElementById("ass")
    select.innerHTML = ""

    for(let i=0;i<data.length;i++){

        const option = document.createElement("option")

        option.value = data[i].title
        option.text = data[i].title

        select.append(option)

    }
}

async function submit(){
    const student_name = document.getElementById("name").value
    const select = document.getElementById("ass")
    const assignment_title = select.options[select.selectedIndex]?.text || ""
    const answer = document.getElementById("answer").value
    const msgDiv = document.getElementById("submitMsg")

    await axios.post("http://localhost:3000/submit",{
        student_name,
        assignment_title,
        answer
    })

    msgDiv.innerHTML = "<span class='success'>Assignment Submitted Successfully!</span>"
    document.getElementById("answer").value = ""
    loadMySubmissions()
}


async function loadMySubmissions(){
    const studentName = sessionStorage.getItem('studentName') || document.getElementById("name").value
    const res = await axios.get(`http://localhost:3000/submission/student/${studentName}`)
    const submissions = res.data

    const d = document.getElementById("data")
    d.innerHTML = ""

    submissions.forEach(sub => {
        const row = document.createElement("tr")
        row.className = sub.status === "Graded" ? "graded" : "submitted"
        
        row.innerHTML = `
            <td>${sub.assignment_title}</td>
            <td>${sub.answer.substring(0, 50)}...</td>
            <td>${sub.submission_date}</td>
            <td>${sub.status}</td>
            <td>${sub.marks || '-'}</td>
        `
        d.append(row)
    })
}

async function loadSubmissions(){
    const res = await axios.get("http://localhost:3000/submission")
    const submissions = res.data

    const tbody = document.getElementById("submissionList")
    tbody.innerHTML = ""

    submissions.forEach((sub, idx) => {
        const row = document.createElement("tr")
        row.innerHTML = `
            <td>${sub.student_name}</td>
            <td>${sub.assignment_title}</td>
            <td>${sub.answer.substring(0, 40)}...</td>
            <td>${sub.submission_date}</td>
            <td>${sub.status}</td>
            <td><input type="number" id="marks${idx}" placeholder="Marks" value="${sub.marks || ''}" style="width: 60px;"></td>
            <td><button onclick="gradeSubmission('${sub._id}', ${idx})">Grade</button></td>
        `
        tbody.append(row)
    })
}

async function gradeSubmission(id, idx){
    const marks = document.getElementById(`marks${idx}`).value
    if(!marks){
        document.getElementById("createMsg").innerHTML = "<span style='color:red'>Please enter marks</span>"
        return
    }
    await axios.post(`http://localhost:3000/submission/${id}/grade`, { marks })
    document.getElementById("createMsg").innerHTML = "<span class='success'>Graded Successfully!</span>"
    loadSubmissions()
}

async function create(){
    const title = document.getElementById("title").value
    const course = document.getElementById("course").value
    const due_date = document.getElementById("date").value
    const description = document.getElementById("description").value
    const msgDiv = document.getElementById("createMsg")

    if(!title || !course || !due_date || !description){
        msgDiv.innerHTML = "<span style='color:red'>Please fill all fields</span>"
        return
    }

    await axios.post("http://localhost:3000/assignment/create",{
        title, course, due_date, description
    })

    msgDiv.innerHTML = "<span class='success'>Assignment Created Successfully!</span>"
    document.getElementById("title").value = ""
    document.getElementById("course").value = ""
    document.getElementById("date").value = ""
    document.getElementById("description").value = ""
}

