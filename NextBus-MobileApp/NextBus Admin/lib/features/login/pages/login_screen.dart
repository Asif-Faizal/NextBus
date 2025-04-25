import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lottie/lottie.dart';
import 'package:next_bus_admin/core/routing/routing_extension.dart';

import '../../../core/routing/route_constatnts.dart';
import '../../../core/routing/routing_arguments.dart';
import '../../../core/storage/shared_preferences_helper.dart';
import '../../../core/theme/theme_cubit.dart';
import '../../../core/widgets/error_snackbar.dart';
import '../../../core/widgets/gradient_background.dart';
import '../bloc/login/login_bloc.dart';

class LoginScreen extends StatelessWidget {
  LoginScreen({super.key, this.arguments});
  final LoginArguments? arguments;
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final isDarkMode = context.watch<ThemeCubit>().state.isDarkMode;

    return GradientBackground(
      isDarkMode: isDarkMode,
      child: BlocListener<LoginBloc, LoginState>(
        listener: (context, state) async {
          if (state is LoginFailure) {
            showErrorSnackBar(context, state.message);
          } else if (state is LoginSuccess) {
            final preferencesHelper = await PreferencesManager.getInstance();
            preferencesHelper.setUserID(state.user.id);
            preferencesHelper.setUsername(state.user.username);
            preferencesHelper.setUserType(state.user.role);
            preferencesHelper.setJWTToken(state.user.token);
            preferencesHelper.setRefreshToken(state.user.refreshToken);
            preferencesHelper.setIsLoggedIn(true);
            if (context.mounted) {
              context.navigateToAndRemoveUntil(
                RouteConstants.dashboard,
                arguments: DashboardArguments(
                  username: state.user.username,
                  userType: state.user.role,
                  userID: state.user.id,
                ),
              );
            }
          }
        },
        child: SafeArea(
          child: Scaffold(
            appBar: AppBar(
              title: const Text('NextBus Admin'),
              backgroundColor: Colors.transparent,
              elevation: 0,
              actions: [
                IconButton(
                  onPressed: () {
                    context.read<ThemeCubit>().toggleTheme();
                  },
                  icon: Icon(isDarkMode ? Icons.light_mode : Icons.dark_mode),
                ),
              ],
            ),
            backgroundColor: Colors.transparent,
            body: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 100),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Lottie.asset(
                      isDarkMode
                          ? 'lib/core/assets/animation/dark-bus.json'
                          : 'lib/core/assets/animation/light-bus.json',
                    ),
                    const SizedBox(height: 30),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (arguments?.isLoggedIn == true)
                                Text('Welcome, ${arguments?.username ?? ''}', style: Theme.of(context).textTheme.labelLarge,),
                              if (arguments?.isLoggedIn == false)
                              TextField(
                                controller: usernameController,
                                decoration: InputDecoration(
                                  labelText: 'Username',
                                  labelStyle:
                                      Theme.of(context).textTheme.labelMedium,
                                  prefixIcon: Icon(
                                    Icons.person,
                                    color:
                                        isDarkMode
                                            ? Colors.white70
                                            : Colors.black54,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              TextField(
                                controller: passwordController,
                                obscureText: true,
                                decoration: InputDecoration(
                                  labelText: 'Password',
                                  labelStyle:
                                      Theme.of(context).textTheme.labelMedium,
                                  prefixIcon: Icon(
                                    Icons.lock,
                                    color:
                                        isDarkMode
                                            ? Colors.white70
                                            : Colors.black54,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 30),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 5,
                                ),
                                child: SizedBox(
                                  width: double.infinity,
                                  height: 50,
                                  child: ElevatedButton(
                                    onPressed: () {
                                      context.read<LoginBloc>().add(
                                        LoginSubmitted(
                                          username: arguments?.isLoggedIn == true ? arguments?.username ?? '' : usernameController.text,
                                          password: passwordController.text,
                                        ),
                                      );
                                    },
                                    child: BlocBuilder<LoginBloc, LoginState>(
                                      builder: (context, state) {
                                        if (state is LoginLoading) {
                                          return const SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: CircularProgressIndicator(),
                                          );
                                        }
                                        return const Text('Login');
                                      },
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
