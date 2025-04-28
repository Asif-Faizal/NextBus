import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/api/api_config.dart';
import 'core/injection/dependency_injection.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_cubit.dart';
import 'core/cubit/date_cubit.dart';
import 'core/routing/navigation_service.dart';
import 'core/routing/route_constatnts.dart';
import 'core/routing/route_generator.dart';
import 'features/bus/bloc/add_new_bus/add_new_bus_bloc.dart';
import 'features/bus/bloc/get_bus_by_id/get_bus_by_id_bloc.dart';
import 'features/bus/bloc/get_bus_list/get_bus_list_bloc.dart';
import 'features/bus/cubits/bus_sub_type_cubit.dart';
import 'features/bus/cubits/bus_type_cubit.dart';
import 'features/bus/cubits/dropdown_selection_cubit.dart';
import 'features/login/bloc/login/login_bloc.dart';
import 'core/storage/shared_preferences_helper.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initDependencyInjection();
  await ApiConfig.loadEnv();
  await PreferencesManager.getInstance();
  SystemChrome.setPreferredOrientations(<DeviceOrientation>[
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]).then((_) {
    runApp(const MyApp());
  });
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => sl<ThemeCubit>()),
        BlocProvider(create: (context) => sl<DateCubit>()),
        BlocProvider(create: (context) => sl<LoginBloc>()),
        BlocProvider(create: (context) => sl<GetBusListBloc>()),
        BlocProvider(create: (context) => sl<GetBusByIdBloc>()),
        BlocProvider(create: (context) => sl<AddNewBusBloc>()),
        BlocProvider(create: (context) => sl<DropdownSelectionCubit>()),
        BlocProvider(create: (context) => sl<BusTypeCubit>()),
        BlocProvider(create: (context) => sl<BusSubTypeCubit>()),
      ],
      child: BlocBuilder<ThemeCubit, ThemeState>(
        builder: (context, state) {
          return MaterialApp(
            title: 'NextBus Admin',
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: state.isDarkMode ? ThemeMode.dark : ThemeMode.light,
            initialRoute: RouteConstants.splash,
            onGenerateRoute: (settings) => RouteGenerator.generateRoute(settings, context),
            navigatorKey: NavigationService().navigatorKey,
          );
        },
      ),
    );
  }
}
