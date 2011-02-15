#include <v8.h>
#include <node.h>
#include <node_buffer.h>

using namespace v8;
using namespace node;

namespace int_float_convert {
  typedef union {
    int i;
    float f;
  } FLOAT_INT;
  
  Handle<Value> int_to_float(const Arguments &args) {
    HandleScope scope;
    
    FLOAT_INT fi;
    fi.i = 0;
    if (args[0]->IsInt32()) fi.i = args[0]->Int32Value();
    return Number::New(fi.f);
  }
  
  Handle<Value> float_to_int(const Arguments &args) {
    HandleScope scope;
    
    FLOAT_INT fi;
    fi.f = 0.0;
    if (args[0]->IsNumber()) fi.f = (float) args[0]->NumberValue();
    return Number::New(fi.i);
  }
}

/*namespace navdata {
  Handle<Value> unpack_buffer(const Arguments &args) {
    HandleScope scope;
    
    if (!Buffer::HasInstance(args[0])) {
      return ThrowException(Exception::TypeError(
        String::New("Expected a buffer")
      ));
    }
    
    Local<Object> buffer = args[0]->ToObject();
    size_t size = Buffer::Length(buffer);
    
    // TODO: Test if size is right
    
    //char *buffer_data = Buffer::Data(buffer_obj);
    //int *buffer_int_data = (int*) buffer_data;
    //return Number::New(&buffer_obj);
  }
}*/

extern "C" void init(Handle<Object> target) {
  HandleScope scope;
  
  target->Set(
    String::New("intToFloat"),
    FunctionTemplate::New(int_float_convert::int_to_float)->GetFunction()
  );
  target->Set(
    String::New("floatToInt"),
    FunctionTemplate::New(int_float_convert::float_to_int)->GetFunction()
  );
  
  /*target->Set(
    String::New("bufferTest"),
    FunctionTemplate::New(navdata::unpack_buffer)->GetFunction()
  );*/
}
