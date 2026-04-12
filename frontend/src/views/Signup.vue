
<template>
	<div class="container">
		<form @submit="signUp">
			<label for="username">Username:</label>
			<input type="text"
				class="input input--block"
				id="username"
			/>
			
			<label for="password">Password:</label>
			<input type="password"
				class="input input--block"
				id="password"
			/>
			
			<label for="email">Email:</label>
			<input type="email"
				class="input input--block"
				id="email"
			/>
			
			<input type="submit"
				class="button button--flat"
				value="save"
			/>
		</form>
	</div>
</template>

<script setup lang="ts">
	
	import { login, signup } from '@/utils/auth';
	import { inject } from 'vue';
	import { useRouter } from 'vue-router';
	import {
		name,
		logoURL,
		recaptcha,
		recaptchaKey,
		signup as signupConstant,
	} from "@/utils/constants";
	
	const router = useRouter();
	const errorToast = inject<IToastError>("$showError")!;
	
	function isNullOrEmpty(value: string | undefined | null): boolean {
		if(value === undefined) { return true; }
		if(value === null) { return true; }
		if(value == "") { return true; }
		if(value == " ") { return true; }
		return false;
	}
	
	function formatErrorMessage(message: string): string {
		if(message.startsWith("400")) {
			const left = message.indexOf('(');
			const right = message.lastIndexOf(')');
			const text = message.substring(left + 1, right);
			
			return text[0].toUpperCase() + text.substring(1);
		}
		if(message.startsWith("409")) {
			return "Username already taken";
		}
		return message;
	}

	async function signUp(ev: Event): Promise<void> {
		const isLocal: boolean = window.location.hostname == "localhost";
		const username: string | undefined = (document.getElementById("username") as HTMLInputElement)?.value;
		const password: string = (document.getElementById("password") as HTMLInputElement)?.value;
		const email: string = (document.getElementById("email") as HTMLInputElement)?.value;
		
		if(isNullOrEmpty(username)) {
			errorToast("Please enter a username", false);
			ev.preventDefault();
			return;
		}
		if(isNullOrEmpty(password)) {
			errorToast("Please enter a password");
			ev.preventDefault();
			return;
		}
		if(isNullOrEmpty(email)) {
			errorToast("Please enter an email");
			ev.preventDefault();
			return;
		}
		
		ev.preventDefault();
		const err = await signup(username, password, email, !isLocal ? "/public" : "/test-env");
		
		if(err.status == 200) {
			let captcha = "";
			
			if(recaptcha) {
				captcha = window.grecaptcha.getResponse();
			}
			await login(username, password, captcha);
			router.push({ path: "/" });
		}
		else {
			errorToast(formatErrorMessage(err.message), true);
		}
	}
	
</script>
