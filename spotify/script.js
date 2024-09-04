import { createClient } from '@supabase/supabase-js'


const supabase = createClient('https://ldmydxsxhanduqnmvhri.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkbXlkeHN4aGFuZHVxbm12aHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NDA0OTgsImV4cCI6MjA0MTAxNjQ5OH0.ActWeX9y_OmLyPrQM2diL9zIec-Z7TxdAdxno5ujbYs', {
    fetch: fetch.bind(globalThis)
   })


   const registerUser = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error(error);
      return;
    }
  
    console.log(`Пользователь ${user.email} зарегистрирован!`);
  };


  const loginUser = async (email, password) => {
    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
  
    if (error) {
      console.error(error);
      return;
    }
  
    console.log(`Пользователь ${user.email} вошел в систему!`);
  };


  document.getElementById("registerButton").addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    registerUser(email, password);
  });
  

  document.getElementById("loginButton").addEventListener("click", () => {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
  
    loginUser(email, password);
  });