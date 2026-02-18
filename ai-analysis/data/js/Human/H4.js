<!-- human-style form -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Contact Form</title>
<style>
body{font-family:sans-serif;margin:20px;}
form{max-width:400px;padding:20px;border:1px solid #ccc;}
input,textarea,button{display:block;width:100%;margin-bottom:8px;padding:6px;}
.error{color:red;}
</style>
</head>
<body>

<h2>Contact Form</h2>
<form id="form">
 <input type="text" id="name" placeholder="Name" required>
 <input type="email" id="email" placeholder="Email" required>
 <textarea id="msg" placeholder="Message" required></textarea>
 <button type="submit">Send</button>
</form>

<div id="res"></div>

<script>
const form=document.getElementById('form');
const res=document.getElementById('res');

form.addEventListener('submit',function(e){
 e.preventDefault();
 const name=document.getElementById('name').value.trim();
 const email=document.getElementById('email').value.trim();
 const msg=document.getElementById('msg').value.trim();

 if(!name || !email || !msg){
  res.innerHTML='<p class="error">Fill all fields</p>';
  return;
 }

 if(!checkEmail(email)){
  res.innerHTML='<p class="error">Email invalid</p>';
  return;
 }

 res.innerHTML='<p>Thanks '+name+', message sent!</p>';
 form.reset();
});

function checkEmail(e){
 const r=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 return r.test(e);
}
</script>

</body>
</html>
