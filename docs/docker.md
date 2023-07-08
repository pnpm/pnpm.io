---
id: docker
title: Working with Docker
---

## Sharing Files Between a Container and the Host Btrfs Filesystem

:::note

This method only works on copy-on-write filesystems supported by the container runtime, such as Btrfs. For other filesystems, like Ext4, pnpm will copy the files instead.

:::

Most popular container runtimes, including Docker and Podman, support copy-on-write filesystems like Btrfs. With Btrfs, container runtimes create actual Btrfs subvolumes for their mounted volumes. pnpm can leverage this behavior to reflink the files between different mounted volumes.

To share files between the host and the container, mount the store directory from the host to the container. This allows pnpm inside the container to naturally reuse the files from the host as reflinks.
