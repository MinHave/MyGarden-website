<template>
  <v-text-field
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :type="showPassword ? 'text' : 'password'"
    v-bind="$attrs"
  >
    <template #append>
      <v-btn tabindex="-1" @click="showPassword = !showPassword" icon>
        <v-icon>{{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'PasswordTextField',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showPassword: false
    }
  }
}
</script>
