import { Button, ButtonTypes } from './Button/Button';
import { InputProfile } from './Input/InputProfile';
import {
  validateEmail,
  validateLogin, validateMessage,
  validateName,
  validatePassword,
  validatePhone,
  validateRepPassword,
} from './Core/Validators';
import { ProfileAvatar } from '../pages/profile/components/avatar/avatar';
import { Block } from './Core/Block/Block';
import { withBlockAsPage } from './Core/Block/BlockAsPage';
import { AvatarLoad } from '../pages/profile/components/avatar/avatarLoad';
import { InputBase, TemplateTypes } from './Input/InputBase';
import { InputBlock } from './Input/InputBlock';
import { InputLight } from './Input/InputLight';
import { ChatList } from '../pages/chat/components/chatList/chatList';
import { ChatPanel } from '../pages/chat/components/chatPanel/chatPanel';

type FormElements = {
  inputElements: Record<string, InputBase>,
  buttonElements: Record<string, Button>,
  passwordElements: Record<string, InputBase>,
  avatars: Record<string, Block>,
};

export function createChatElements(): Omit<FormElements, 'avatars' | 'passwordElements'> & { chat: Record<string, Block> } {
  const inputSearch = new InputLight({
    form_element_id: 'search',
    form_element_name: 'Search',
    form_element_placeholder: 'Search',
    template_type: TemplateTypes.ONLY_INPUT,
    validator: validateMessage,
  });

  const buttonAddChat = new Button({
    button_name: '',
    button_id: 'buttonAddChat',
    button_type: ButtonTypes.ADD,
  });

  const chatList = new ChatList();

  const chatPanel = new (withBlockAsPage(ChatPanel) as typeof ChatPanel)();

  const inputElements = { inputSearch };

  const buttonElements = { buttonAddChat };

  return { inputElements, buttonElements, chat: { chatList, chatPanel } };
}

export function createRegisterElements(): FormElements {
  const inputEmail = new InputBlock({
    form_element_id: 'email',
    form_element_name: 'Email',
    form_element_placeholder: '',
    validator: validateEmail,
    value: '',
    is_readonly: false,
  });

  const inputLogin = new InputBlock({
    form_element_id: 'login',
    form_element_name: 'Login',
    form_element_placeholder: '',
    validator: validateLogin,
    value: '',
    is_readonly: false,
  });

  const inputFirstName = new InputBlock({
    form_element_id: 'first_name',
    form_element_name: 'Name',
    form_element_placeholder: '',
    validator: validateName,
    value: '',
    is_readonly: false,
  });

  const inputSecondName = new InputBlock({
    form_element_id: 'second_name',
    form_element_name: 'Second name',
    form_element_placeholder: '',
    validator: validateName,
    value: '',
    is_readonly: false,
  });

  const inputPhone = new InputBlock({
    form_element_id: 'phone',
    form_element_name: 'Phone',
    form_element_placeholder: '',
    validator: validatePhone,
    value: '',
    is_readonly: false,
  });

  const buttonRegister = new Button({
    button_id: 'buttonRegister',
    button_name: 'Create profile',
  });

  const buttonSignin = new Button({
    button_id: 'buttonSignin',
    button_name: 'Sign in',
    button_type: ButtonTypes.LINK,
  });

  const inputPassword = new InputBlock({
    form_element_id: 'password',
    form_element_name: 'Password',
    is_password: true,
    validator: validatePassword,
    value: '',
    alert_text: 'Больше 8 символов, хотя бы одна цифра и прописная буква',
  });

  const inputPasswordRepeat = new InputBlock({
    form_element_id: 'password-repeat',
    form_element_name: 'Repeat password',
    is_password: true,
    is_repeat_password: true,
    password_input: inputPassword,
    value: '',
    validator: validateRepPassword,
    alert_text: 'Пароли не совпадают',
  });

  const inputElements = {
    inputEmail,
    inputFirstName,
    inputSecondName,
    inputPhone,
    inputLogin,
  };

  const buttonElements = {
    buttonSignin,
    buttonRegister,
  };

  const passwordElements = {
    inputPassword,
    inputPasswordRepeat,
  };

  return {
    buttonElements, inputElements, passwordElements, avatars: { },
  };
}

export function createProfileElements() {
  const buttonBack = new Button({
    button_name: '',
    button_id: 'buttonBack',
    button_type: ButtonTypes.BACK,
  });

  const buttonSave = new Button({
    button_name: 'Save',
    button_id: 'buttonSave',
    button_type: ButtonTypes.AZUL,
  });

  const buttonProfileChange = new Button({
    button_name: 'Change profile',
    button_id: 'buttonChangeProfile',
    button_type: ButtonTypes.LINK,
    parent_class: 'right-panel-form-element',
    data_test_id: 'buttonChangeProfile',
  });

  const buttonCancelSave = new Button({
    button_name: 'Cancel',
    button_id: 'buttonCancelSave',
    button_type: ButtonTypes.LINK,
  });

  const buttonPasswordChange = new Button({
    button_name: 'Change password',
    button_id: 'buttonChangePassword',
    button_type: ButtonTypes.LINK,
    parent_class: 'right-panel-form-element',
  });

  const buttonSignOut = new Button({
    button_name: 'Sign out',
    button_id: 'buttonSignOut',
    button_type: ButtonTypes.LINK,
    parent_class: 'right-panel-form-element',
    show_as_error: true,
  });

  const inputEmail = new InputProfile({
    form_element_id: 'email',
    form_element_name: 'Email',
    form_element_placeholder: '',
    validator: validateEmail,
    value: '',
    is_readonly: true,
  });

  const inputLogin = new InputProfile({
    form_element_id: 'login',
    form_element_name: 'Login',
    form_element_placeholder: '',
    validator: validateLogin,
    value: '',
    is_readonly: true,
  });

  const inputFirstName = new InputProfile({
    form_element_id: 'first_name',
    form_element_name: 'Name',
    form_element_placeholder: '',
    validator: validateName,
    value: '',
    is_readonly: true,
  });

  const inputSecondName = new InputProfile({
    form_element_id: 'second_name',
    form_element_name: 'Second name',
    form_element_placeholder: '',
    validator: validateName,
    value: '',
    is_readonly: true,
  });

  const inputPhone = new InputProfile({
    form_element_id: 'phone',
    form_element_name: 'Phone',
    form_element_placeholder: '',
    validator: validatePhone,
    value: '',
    is_readonly: true,
  });

  const inputDisplayName = new InputProfile({
    form_element_id: 'display_name',
    form_element_name: 'Display name',
    form_element_placeholder: '',
    validator: validateName,
    value: '',
    is_readonly: true,
  });

  const inputOldPassword = new InputProfile({
    form_element_id: 'oldPassword',
    form_element_name: 'Old password',
    form_element_placeholder: '',
    validator: validatePassword,
    value: '',
    is_password: true,
  });

  const inputNewPassword = new InputProfile({
    form_element_id: 'newPassword',
    form_element_name: 'New password',
    form_element_placeholder: '',
    validator: validatePassword,
    value: '',
    is_password: true,
  });

  const inputNewPasswordRepeate = new InputProfile({
    form_element_id: 'newPassword_repeate',
    form_element_name: 'Repeat new password',
    form_element_placeholder: '',
    is_repeat_password: true,
    password_input: inputNewPassword,
    validator: validateRepPassword,
    value: '',
    is_password: true,
  });

  const avatar = new ProfileAvatar();

  const avatarLoad = new (withBlockAsPage(AvatarLoad) as typeof Block)();

  const buttonElements = {
    buttonBack,
    buttonSave,
    buttonProfileChange,
    buttonSignOut,
    buttonPasswordChange,
    buttonCancelSave,
  };

  const inputElements: Record<string, InputBase> = {
    inputEmail, inputLogin, inputFirstName, inputSecondName, inputDisplayName, inputPhone,
  };

  const passwordElements = {
    inputOldPassword, inputNewPassword, inputNewPasswordRepeate,
  };

  return {
    buttonElements, inputElements, passwordElements, avatars: { avatar, avatarLoad },
  };
}

export function createLoginElements(): FormElements {
  const inputLogin = new InputBlock({
    form_element_id: 'login',
    form_element_name: 'Login',
    alert_text: 'Только буквы, начинаться с маленькой буквы',
    validator: validateLogin,
  });

  const inputPassword = new InputBlock({
    form_element_id: 'password',
    form_element_name: 'Password',
    alert_text: 'Больше 8 символов, хотя бы одна цифра и прописная буква',
    is_password: true,
    validator: validatePassword,
  });

  const buttonLogin = new Button({
    button_id: 'buttonLogin',
    button_name: 'Login',
    data_test_id: 'buttonLogin',
  });

  const buttonSignup = new Button({
    button_id: 'buttonSignup',
    button_name: 'Sign up',
    button_type: ButtonTypes.LINK,
    data_test_id: 'buttonSignup',
  });

  const inputElements = { inputPassword };
  const passwordElements = { inputLogin };
  const buttonElements = {
    buttonLogin,
    buttonSignup,
  };

  return {
    inputElements, buttonElements, passwordElements, avatars: {},
  };
}
