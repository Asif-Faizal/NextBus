import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/bus_entity.dart';
import '../../domain/usecases/delete_bus.dart';

part 'delete_bus_event.dart';
part 'delete_bus_state.dart';

class DeleteBusBloc extends Bloc<DeleteBusEvent, DeleteBusState> {
  final DeleteBusUsecase deleteBusUsecase;
  DeleteBusBloc({required this.deleteBusUsecase}) : super(DeleteBusInitial()) {
    on<DeleteBus>(_onDeleteBus);
  }

  void _onDeleteBus(DeleteBus event, Emitter<DeleteBusState> emit) async {
    emit(DeleteBusLoading());
    final result = await deleteBusUsecase(event.id);
    result.fold(
      (failure) => emit(DeleteBusFailure(failure.toString())),
      (success) => emit(DeleteBusSuccess(success)),
    );
  }
}
