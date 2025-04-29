part of 'get_edit_request_bloc.dart';

abstract class GetEditRequestEvent extends Equatable {
  const GetEditRequestEvent();

  @override
  List<Object> get props => [];
}

class FetchEditRequest extends GetEditRequestEvent {
  final String id;

  const FetchEditRequest(this.id);

  @override
  List<Object> get props => [id];
}