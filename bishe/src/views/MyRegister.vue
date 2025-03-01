<template>
    <div class="register">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
              <el-input 
                type="text"
                v-model="ruleForm.phone" 
                autocomplete="off" 
                max-length="11"
                @input="inputTest">
              </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mail">
              <el-input type="email" v-model="ruleForm.mail" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" prop="date">
            <el-date-picker
              type="date"
              v-model="ruleForm.date"
              size="large"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上传头像" prop="image">
            <el-upload
              name="avatar"
              v-model="ruleForm.image"
              class="avatar-uploader"
              action="http://localhost:3000/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.image" :src="ruleForm.image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
              <el-button @click="loginForm('ruleForm')">注册</el-button>
              <el-button @click="gotoLogin">返回</el-button>
          </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>    
  import axios from 'axios'
  import moment from 'moment'
  export default {

      data() {
        var validateUsername = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入用户名'));
          } 
          callback()
        };
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.ruleForm.pass) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        var validateMail = (rule, value, callback) => {
          const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
          if (value === '') {
            callback(new Error('请输入邮箱'));
          }else if(value !=='' && !regEmail.test(this.ruleForm.mail)){
            callback(new Error('邮箱格式不对'));
          }
          callback()
        };
        var validatePhone = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入电话号码'));
          }
          if (!/^1[35789]\d{9}$/.test(value)) {
            callback(new Error('手机号格式不正确'))
          }
          callback()
        };
        var validateImage = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请上传头像'));
          }
          callback()
        };
        var validateDate = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请选择出生日期'));
          }
          callback()
        };
        return {
          ruleForm: {
            pass: '',
            checkPass: '',
            username: '',
            mail:'',
            phone:'',
            image:'',
            date:new Date(),
            nowTime:null,
          },
          rules: {
            pass: [
              { validator: validatePass, trigger: 'blur' }
            ],
            checkPass: [
              { validator: validatePass2, trigger: 'blur' }
            ],
            username:[
              {validator: validateUsername,trigger:'blur'}
            ],
            mail:[
              {validator: validateMail,trigger:'blur'}
            ],
            phone:[
              {validator: validatePhone,trigger:'blur'}
            ],
            image:[
              {validator: validateImage,trigger:'blur'}
            ],
            date:[
              {validator: validateDate,trigger:'blur'}
            ],
          },
        };
      },
      methods: {
      loginForm(formName) {
          this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
          this.ruleForm.date = this.ruleForm.date.toLocaleDateString()
          console.log(this.ruleForm.date);
          axios({
            method:'POST',
            url:'http://localhost:3000/register',
            data:this.ruleForm
          }).then((res) => {
            console.log(res);
            alert(res.data.message)
            this.$router.push('/login')
          }).catch(error =>{
            alert(error.$message)
          })
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      },
      gotoLogin(){
        this.$router.replace('/login')
      },
      handleAvatarSuccess(res) {
        if (res.status === '1') return this.$message.error(res.message)
          this.ruleForm.image = `${res.url}`  //拼接路径
          this.$message.success('上传头像成功')
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      inputTest(){
        this.ruleForm.phone = this.ruleForm.phone.replace(/[^\d]/g, '');  
      },
      },
  }
  </script>
  
  <style>
  .register {
      width: 100%;
      display: flex;
      justify-content: center;
  }
  .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>