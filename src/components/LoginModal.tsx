import {
  Button,
  Callout,
  Dialog,
  Flex,
  IconButton,
  TextField,
} from "@radix-ui/themes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Icon } from "./Common/Icon";

export function LoginModal() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState("");

  async function handleLogin() {
    try {
      await auth.login(username, password);
      navigate(0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);

      if (error.name === "FirebaseError") {
        setLoginError("Error: Invalid Credentials.");
      } else {
        setLoginError("Error: Something went wrong.");
      }
    }
  }

  async function handleLogout() {
    await auth.logout();
    navigate(0);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setUsername("");
      setPassword("");
    }
  }

  function canSubmit(): boolean {
    return !!username && !!password;
  }

  if (auth.user) {
    return (
      <IconButton variant="soft" onClick={handleLogout}>
        <Icon icon="sign-out" size="xs" />
      </IconButton>
    );
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button className="h-10" variant="soft">
          <Icon icon="user-circle" />
          Login
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content>
        <Dialog.Title>Login</Dialog.Title>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Username</b>
          </p>
          <TextField.Root
            className="input-field"
            placeholder="Username..."
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          ></TextField.Root>
        </div>

        <div className="mb-5">
          <p className="field-label mb-1">
            <b>Password</b>
          </p>
          <TextField.Root
            className="input-field"
            type="password"
            placeholder="Password..."
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          ></TextField.Root>
        </div>

        {loginError && (
          <Callout.Root color="red">
            <Callout.Icon>
              <Icon icon="circle-info" />
            </Callout.Icon>
            <Callout.Text>{loginError}</Callout.Text>
          </Callout.Root>
        )}

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close>
            <Button className="h-10" variant="outline">
              <Icon icon="xmark" size="xs" />
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            className="h-10"
            disabled={!canSubmit()}
            onClick={handleLogin}
          >
            <Icon icon="check" size="xs" />
            Login
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
