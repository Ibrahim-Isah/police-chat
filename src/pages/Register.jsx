import { doc, setDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { notifyError, notifySuccess } from '../utils/notification';
import Add from '../img/addAvatar.png';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Register = () => {
	const navigate = useNavigate();

	const [createUserWithEmailAndPassword, userCred, loading, userError] =
		useCreateUserWithEmailAndPassword(auth);

	const [signUpForm, setSignUpForm] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [selectedFile, setSelectedFile] = useState();
  const [fileURL, setFileURL] = useState();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (signUpForm.password !== signUpForm.confirmPassword) {
			notifyError('Passwords do not match');
			return;
		}
		const res = await createUserWithEmailAndPassword(
			signUpForm.email,
			signUpForm.password
		);
		const date = new Date().getTime();
		const storageRef = ref(storage, `${signUpForm.displayName + date}`);

		await uploadBytesResumable(storageRef, selectedFile).then(() => {
			getDownloadURL(storageRef).then(async (downloadURL) => {
				try {
					await updateProfile(res.user || userCred.user, {
						displayName: signUpForm.displayName,
						photoURL: downloadURL,
					});

					await setDoc(doc(db, 'users', res.user.uid), {
						uid: res.user.uid,
						displayName: signUpForm.displayName,
						email: signUpForm.email,
						photoURL: downloadURL,
					});

					await setDoc(doc(db, 'userChats', res.user.uid), {});
					notifySuccess('User successfully created');
					navigate('/');
				} catch (err) {
					console.log(err);
					notifyError('Something went wrong');
				}
			});
		});
	};
	const onChange = (event) => {
		setSignUpForm((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleFileUpload = (e) => {
		const file = e.target.files ? e.target.files[0] : undefined;

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileURL = event.target.result;
        setFileURL({ fileURL });
      };

      reader.readAsDataURL(file);
    }
		setSelectedFile(file);
	};

	return (
		<div className='formContainer'>
			<div className='formWrapper'>
				<span className='logo'>Police Chat</span>
				<span className='title'>Register</span>
				<form>
					<input
						required
						type='text'
						name='displayName'
						onChange={onChange}
						placeholder='display name'
					/>
					<input
						required
						type='email'
						name='email'
						onChange={onChange}
						placeholder='email'
					/>
					<input
						required
						type={'password'}
						name='password'
						placeholder='password'
						onChange={onChange}
					/>
					<input
						required
						type={'confirmPassword'}
						name='confirmPassword'
						placeholder='confirmPassword'
						onChange={onChange}
					/>
					<input
						required
						style={{ display: 'none' }}
						name='image'
						id='file'
						type='file'
						onChange={handleFileUpload}
					/>
					<label htmlFor='file'>
						<img src={fileURL || Add} alt='' />
						<span>Add an avatar</span>
					</label>
					<button disabled={loading} onClick={handleSubmit}>
						Sign up
					</button>
				</form>
				<p>
					You do have an account? <Link to='/register'>Login</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
