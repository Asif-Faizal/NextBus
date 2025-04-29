import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;

import '../../features/bus/bloc/add_new_bus/add_new_bus_bloc.dart';
import '../../features/bus/bloc/approve_bus/approve_bus_bloc.dart';
import '../../features/bus/bloc/approve_edit/approve_edit_bloc.dart';
import '../../features/bus/bloc/delete_bus/delete_bus_bloc.dart';
import '../../features/bus/bloc/edit_bus/edit_bus_bloc.dart';
import '../../features/bus/bloc/get_bus_by_id/get_bus_by_id_bloc.dart';
import '../../features/bus/bloc/get_bus_list/get_bus_list_bloc.dart';
import '../../features/bus/bloc/get_edit_request/get_edit_request_bloc.dart';
import '../../features/bus/bloc/reject_approval/reject_approval_bloc.dart';
import '../../features/bus/cubits/bus_sub_type_cubit.dart';
import '../../features/bus/cubits/bus_type_cubit.dart';
import '../../features/bus/cubits/dropdown_selection_cubit.dart';
import '../../features/bus/data/bus_datasource.dart';
import '../../features/bus/data/bus_repo_impl.dart';
import '../../features/bus/data/models/bus_request_model.dart';
import '../../features/bus/domain/usecases/add_bus.dart';
import '../../features/bus/domain/bus_repo.dart';
import '../../features/bus/domain/usecases/approve_bus.dart';
import '../../features/bus/domain/usecases/approve_edit.dart';
import '../../features/bus/domain/usecases/delete_bus.dart';
import '../../features/bus/domain/usecases/edit_bus.dart';
import '../../features/bus/domain/usecases/get_bus_by_id.dart';
import '../../features/bus/domain/usecases/get_buses.dart';
import '../../features/bus/domain/usecases/get_edit_request.dart';
import '../../features/bus/domain/usecases/reject_approval.dart';
import '../../features/login/bloc/login/login_bloc.dart';
import '../../features/login/data/login/login_datasource.dart';
import '../../features/login/data/login/login_repo_impl.dart';
import '../../features/login/domain/login/login.dart';
import '../../features/login/domain/login/login_repo.dart';
import '../cubit/date_cubit.dart';
import '../error/exception_handler.dart';
import '../network/network_info.dart';
import '../theme/theme_cubit.dart';
import '../api/api_config.dart';

final sl = GetIt.instance;

Future<void> initDependencyInjection() async {
  // Core
  sl.registerLazySingleton(() => http.Client());
  sl.registerLazySingleton(() => Connectivity());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl(sl()));
  sl.registerLazySingleton<ExceptionHandler>(() => ExceptionHandler(sl()));
  sl.registerLazySingleton<DropdownSelectionCubit>(() => DropdownSelectionCubit());
  
  // API Configuration
  sl.registerLazySingleton<String>(() => ApiConfig.nextBusUrl);
  
  // Auth
  sl.registerLazySingleton<AuthRemoteDataSource>(() => AuthRemoteDataSourceImpl(sl()));
  sl.registerLazySingleton<AuthRepository>(() => AuthRepositoryImpl(remoteDataSource: sl(), networkInfo: sl()));
  sl.registerLazySingleton<LoginUseCase>(() => LoginUseCase(sl()));
  sl.registerLazySingleton<LoginBloc>(() => LoginBloc(sl()));

  // Theme and Date
  sl.registerLazySingleton<ThemeCubit>(() => ThemeCubit());
  sl.registerLazySingleton<DateCubit>(() => DateCubit());

  // Bus
  sl.registerLazySingleton<BusRemoteDataSource>(() => BusRemoteDataSourceImpl(client: sl(), baseUrl: sl<String>()));
  sl.registerLazySingleton<BusRepository>(() => BusRepositoryImpl(remoteDataSource: sl()));
  sl.registerLazySingleton<GetBusesUseCase>(() => GetBusesUseCase(sl()));
  sl.registerLazySingleton<GetBusListBloc>(() => GetBusListBloc(getBusesUseCase: sl()));
  sl.registerLazySingleton<BusListRequestModel>(() => BusListRequestModel(
        busType: '',
        busSubType: '',
        busName: '',
        page: 1,
        limit: 5,
      ));
  sl.registerLazySingleton<GetBusByIdUseCase>(() => GetBusByIdUseCase(sl()));
  sl.registerLazySingleton<GetBusByIdBloc>(() => GetBusByIdBloc(getBusByIdUseCase: sl()));
  sl.registerLazySingleton<AddBusUsecase>(() => AddBusUsecase(repository: sl()));
  sl.registerLazySingleton<AddNewBusBloc>(() => AddNewBusBloc(addBusUsecase: sl()));
  sl.registerLazySingleton<BusTypeCubit>(() => BusTypeCubit(globalCubit: sl()));
  sl.registerLazySingleton<BusSubTypeCubit>(() => BusSubTypeCubit(globalCubit: sl()));
  sl.registerLazySingleton<ApproveBusUsecase>(() => ApproveBusUsecase(repository: sl()));
  sl.registerLazySingleton<ApproveBusBloc>(() => ApproveBusBloc(approveBusUsecase: sl()));
  sl.registerLazySingleton<EditBusUsecase>(() => EditBusUsecase(repository: sl()));
  sl.registerLazySingleton<EditBusBloc>(() => EditBusBloc(editBusUsecase: sl()));
  sl.registerLazySingleton<GetEditRequestUsecase>(() => GetEditRequestUsecase(repository: sl()));
  sl.registerLazySingleton<GetEditRequestBloc>(() => GetEditRequestBloc(getEditRequest: sl()));
  sl.registerLazySingleton<ApproveEditUsecase>(() => ApproveEditUsecase(repository: sl()));
  sl.registerLazySingleton<ApproveEditBloc>(() => ApproveEditBloc(approveEditUsecase: sl()));
  sl.registerLazySingleton<RejectApprovalUsecase>(() => RejectApprovalUsecase(busRepository: sl()));
  sl.registerLazySingleton<RejectApprovalBloc>(() => RejectApprovalBloc(rejectApprovalUsecase: sl()));
  sl.registerLazySingleton<DeleteBusUsecase>(() => DeleteBusUsecase(busRepository: sl()));
  sl.registerLazySingleton<DeleteBusBloc>(() => DeleteBusBloc(deleteBusUsecase: sl()));
}
