import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../domain/bus_entity.dart';
import '../../domain/get_bus_by_id.dart';

part 'get_bus_by_id_event.dart';
part 'get_bus_by_id_state.dart';

class GetBusByIdBloc extends Bloc<GetBusByIdEvent, GetBusByIdState> {
  final GetBusByIdUseCase getBusByIdUseCase;

  GetBusByIdBloc({required this.getBusByIdUseCase}) : super(GetBusByIdInitial()) {
    on<FetchBusById>(_onFetchBusById);
  }

  void _onFetchBusById(FetchBusById event, Emitter<GetBusByIdState> emit) async {
    emit(GetBusByIdLoading());
    final result = await getBusByIdUseCase(event.id);
    result.fold(
      (failure) => emit(GetBusByIdError(message: failure.toString())),
      (bus) => emit(GetBusByIdLoaded(bus: bus)),
    );
  }
}
