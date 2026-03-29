import { Form, Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    // canRegister,
}: Props) {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.login')}
            description={t('auth.loginDescription')}
        >
            <Head title={t('auth.login')} />

            {status && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="font-medium">
                                {t('auth.email')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="email@example.com"
                                dir="ltr"
                                className="text-left h-11 transition-colors focus:border-emerald-500"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password" className="font-medium">
                                    {t('auth.password')}
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="ms-auto text-xs text-[#27ae60] hover:text-[#229954]"
                                        tabIndex={5}
                                    >
                                        {t('auth.forgotPassword')}
                                    </TextLink>
                                )}
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder={t('auth.password')}
                                className="text-left h-11"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="border-emerald-400 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <Label htmlFor="remember" className="cursor-pointer text-sm text-muted-foreground">
                                {t('auth.rememberMe')}
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full h-11 bg-[#27ae60] hover:bg-[#229954] text-white font-semibold shadow-lg shadow-[#27ae60]/25 transition-all"
                            size="lg"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            {t('auth.loginButton')}
                        </Button>
                    </div>
                )}
            </Form>

            {/* Registration disabled - uncomment when needed */}
            {/* {canRegister && (
                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <TextLink href={register()} tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            )} */}
        </AuthLayout>
    );
}
