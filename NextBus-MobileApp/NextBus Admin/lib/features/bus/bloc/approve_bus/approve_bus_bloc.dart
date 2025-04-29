import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/models/bus_response_model.dart';
import '../../domain/usecases/approve_bus.dart';

part 'approve_bus_event.dart';
part 'approve_bus_state.dart';

class ApproveBusBloc extends Bloc<ApproveBusEvent, ApproveBusState> {
  final ApproveBusUsecase approveBusUsecase;
  ApproveBusBloc({required this.approveBusUsecase}) : super(ApproveBusInitial()) {
    on<ApproveBus>(_onApproveBus);
  }

  void _onApproveBus(ApproveBus event, Emitter<ApproveBusState> emit) async {
    emit(ApproveBusLoading());
    final result = await approveBusUsecase(event.id);
    result.fold(
      (failure) => emit(ApproveBusFailure(message: failure.toString())),
      (success) => emit(ApproveBusSuccess(bus: success)),
    );
  }
}